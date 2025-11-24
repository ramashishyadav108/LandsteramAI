import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import prisma from '../config/db.js';
import { sendConfirmedMeetingNotification } from '../services/mailService.js';

/**
 * Handle Calendly webhook events
 * This endpoint receives notifications when events occur in Calendly
 */
export const handleCalendlyWebhook = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const event = req.body;

    logger.info('Received Calendly webhook', {
      event: event.event,
      payload: JSON.stringify(event.payload),
    });

    // Handle invitee.created event (when someone books a meeting)
    if (event.event === 'invitee.created') {
      await handleInviteeCreated(event.payload);
    }

    // Handle invitee.canceled event (when someone cancels)
    if (event.event === 'invitee.canceled') {
      await handleInviteeCanceled(event.payload);
    }

    // Respond with 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Failed to process Calendly webhook', error);
    // Still return 200 to avoid Calendly retrying
    res.status(200).json({ received: true, error: 'Processing failed' });
  }
};

/**
 * Handle when an invitee books a meeting
 */
async function handleInviteeCreated(payload: any): Promise<void> {
  try {
    const eventUri = payload.event?.uri;
    const meetingLink = payload.event?.location?.join_url || payload.event?.uri;

    if (!eventUri) {
      logger.warn('No event URI in webhook payload');
      return;
    }

    // Find the meeting in our database by Calendly event URI
    const meeting = await prisma.meeting.findUnique({
      where: { calendlyEventUri: eventUri },
      include: {
        lender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!meeting) {
      logger.warn('Meeting not found for Calendly event', { eventUri });
      return;
    }

    // Update meeting with final meeting link and confirmed status
    await prisma.meeting.update({
      where: { id: meeting.id },
      data: {
        meetingLink: meetingLink,
        confirmedAt: new Date(),
        status: 'SCHEDULED',
      },
    });

    logger.info('Meeting confirmed, sending notifications', {
      meetingId: meeting.id,
      borrowerEmail: meeting.borrowerId,
      rmEmail: meeting.rmEmail,
      additionalEmails: meeting.additionalEmails,
    });

    // Send confirmation emails to all participants
    const recipients: string[] = [];

    // 1. Lender (meeting creator)
    recipients.push(meeting.lender.email);

    // 2. Borrower
    recipients.push(meeting.borrowerId);

    // 3. RM (if provided)
    if (meeting.rmEmail) {
      recipients.push(meeting.rmEmail);
    }

    // 4. Additional emails
    if (meeting.additionalEmails && meeting.additionalEmails.length > 0) {
      recipients.push(...meeting.additionalEmails);
    }

    // Send emails to all recipients
    const emailPromises = recipients.map((email) =>
      sendConfirmedMeetingNotification(
        email,
        meeting.lender.name || meeting.lender.email,
        meeting.borrowerId,
        meeting.startTime,
        meeting.duration,
        meetingLink
      )
    );

    const results = await Promise.allSettled(emailPromises);

    // Log results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        logger.info('Confirmation email sent', { to: recipients[index] });
      } else {
        logger.warn('Failed to send confirmation email', { to: recipients[index] });
      }
    });
  } catch (error) {
    logger.error('Failed to handle invitee.created event', error);
    throw error;
  }
}

/**
 * Handle when an invitee cancels a meeting
 */
async function handleInviteeCanceled(payload: any): Promise<void> {
  try {
    const eventUri = payload.event?.uri;

    if (!eventUri) {
      logger.warn('No event URI in webhook payload');
      return;
    }

    // Find and update the meeting
    const meeting = await prisma.meeting.findUnique({
      where: { calendlyEventUri: eventUri },
    });

    if (!meeting) {
      logger.warn('Meeting not found for canceled event', { eventUri });
      return;
    }

    await prisma.meeting.update({
      where: { id: meeting.id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
        cancelReason: 'Canceled via Calendly',
      },
    });

    logger.info('Meeting canceled via Calendly', { meetingId: meeting.id });
  } catch (error) {
    logger.error('Failed to handle invitee.canceled event', error);
    throw error;
  }
}
