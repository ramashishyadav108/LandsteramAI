import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const transporter: Transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string): Promise<boolean> => {
  const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: env.SMTP_FROM,
    to: email,
    subject: 'Verify Your Email Address',
    text: `
Email Verification

Thank you for signing up! Please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours. If you didn't create an account, please ignore this email.
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info('✅ Verification email sent successfully', { to: email });
    return true;
  } catch (error) {
    logger.error('❌ Failed to send verification email', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (email: string, token: string): Promise<boolean> => {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: env.SMTP_FROM,
    to: email,
    subject: 'Reset Your Password',
    text: `
Password Reset Request

You requested to reset your password. Click the link below to proceed:

${resetUrl}

This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info('✅ Password reset email sent successfully', { to: email });
    return true;
  } catch (error) {
    logger.error('❌ Failed to send password reset email', error);
    return false;
  }
};

/**
 * Send meeting invitation with scheduling link to borrower
 */
export const sendMeetingInvitationToBorrower = async (
  borrowerEmail: string,
  lenderName: string,
  bookingUrl: string,
  startTime: Date,
  duration: number
): Promise<boolean> => {
  const formattedDate = startTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const mailOptions = {
    from: env.SMTP_FROM,
    to: borrowerEmail,
    subject: `Meeting Invitation from ${lenderName}`,
    text: `
Meeting Invitation

${lenderName} has invited you to a meeting.

Proposed Date & Time: ${formattedDate}
Duration: ${duration} minutes

To confirm and schedule this meeting, please click the link below:

${bookingUrl}

If you have any questions, please contact ${lenderName} directly.
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Meeting Invitation</h1>
    </div>
    <div class="content">
      <p><strong>${lenderName}</strong> has invited you to a meeting.</p>
      <p><strong>Proposed Date & Time:</strong><br>${formattedDate}</p>
      <p><strong>Duration:</strong> ${duration} minutes</p>
      <p>To confirm and schedule this meeting, please click the button below:</p>
      <a href="${bookingUrl}" class="button">Schedule Meeting</a>
    </div>
    <div class="footer">
      <p>If you have any questions, please contact ${lenderName} directly.</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info('✅ Meeting invitation email sent to borrower', { to: borrowerEmail });
    return true;
  } catch (error) {
    logger.error('❌ Failed to send meeting invitation email to borrower', error);
    return false;
  }
};

/**
 * Send meeting notification to RM (without scheduling link)
 */
export const sendMeetingNotificationToRM = async (
  rmEmail: string,
  lenderName: string,
  borrowerEmail: string,
  startTime: Date,
  duration: number
): Promise<boolean> => {
  const formattedDate = startTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const mailOptions = {
    from: env.SMTP_FROM,
    to: rmEmail,
    subject: `Meeting Scheduled - ${lenderName} & ${borrowerEmail}`,
    text: `
Meeting Notification

A meeting has been scheduled by ${lenderName}.

Borrower: ${borrowerEmail}
Proposed Date & Time: ${formattedDate}
Duration: ${duration} minutes

The borrower will receive an invitation to confirm this meeting. You will receive the final meeting link once the borrower confirms.
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px; }
    .info-box { background-color: #e3f2fd; padding: 15px; border-left: 4px solid #2196F3; margin: 15px 0; }
    .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Meeting Notification</h1>
    </div>
    <div class="content">
      <p>A meeting has been scheduled by <strong>${lenderName}</strong>.</p>
      <div class="info-box">
        <p><strong>Borrower:</strong> ${borrowerEmail}</p>
        <p><strong>Proposed Date & Time:</strong><br>${formattedDate}</p>
        <p><strong>Duration:</strong> ${duration} minutes</p>
      </div>
      <p>The borrower will receive an invitation to confirm this meeting. You will receive the final meeting link once the borrower confirms.</p>
    </div>
    <div class="footer">
      <p>This is an automated notification from KratosAI.</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info('✅ Meeting notification email sent to RM', { to: rmEmail });
    return true;
  } catch (error) {
    logger.error('❌ Failed to send meeting notification email to RM', error);
    return false;
  }
};

/**
 * Send meeting notification to lender (without scheduling link)
 */
/**
 * Send confirmed meeting details to all participants
 */
export const sendConfirmedMeetingNotification = async (
  recipientEmail: string,
  lenderName: string,
  borrowerEmail: string,
  startTime: Date,
  duration: number,
  meetingLink: string
): Promise<boolean> => {
  const formattedDate = startTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const mailOptions = {
    from: env.SMTP_FROM,
    to: recipientEmail,
    subject: `Meeting Confirmed - ${lenderName} & ${borrowerEmail}`,
    text: `
Meeting Confirmed!

The meeting has been confirmed by the borrower.

Lender: ${lenderName}
Borrower: ${borrowerEmail}
Date & Time: ${formattedDate}
Duration: ${duration} minutes

Join the meeting:
${meetingLink}

See you there!
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px; }
    .info-box { background-color: #d1fae5; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0; }
    .button { display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Meeting Confirmed!</h1>
    </div>
    <div class="content">
      <p>Great news! The meeting has been confirmed.</p>
      <div class="info-box">
        <p><strong>Lender:</strong> ${lenderName}</p>
        <p><strong>Borrower:</strong> ${borrowerEmail}</p>
        <p><strong>Date & Time:</strong><br>${formattedDate}</p>
        <p><strong>Duration:</strong> ${duration} minutes</p>
      </div>
      <p>Click the button below to join the meeting:</p>
      <a href="${meetingLink}" class="button">Join Meeting</a>
    </div>
    <div class="footer">
      <p>This is an automated notification from KratosAI.</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info('✅ Confirmed meeting notification sent', { to: recipientEmail });
    return true;
  } catch (error) {
    logger.error('❌ Failed to send confirmed meeting notification', error);
    return false;
  }
};

export const sendMeetingNotificationToLender = async (
  lenderEmail: string,
  _lenderName: string,
  borrowerEmail: string,
  startTime: Date,
  duration: number
): Promise<boolean> => {
  const formattedDate = startTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const mailOptions = {
    from: env.SMTP_FROM,
    to: lenderEmail,
    subject: `Meeting Request Sent - ${borrowerEmail}`,
    text: `
Meeting Request Confirmation

You have successfully scheduled a meeting request.

Borrower: ${borrowerEmail}
Proposed Date & Time: ${formattedDate}
Duration: ${duration} minutes

The borrower will receive an invitation to confirm this meeting. You will receive the final meeting link once the borrower confirms.
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px; }
    .info-box { background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4CAF50; margin: 15px 0; }
    .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Meeting Request Sent</h1>
    </div>
    <div class="content">
      <p>You have successfully scheduled a meeting request.</p>
      <div class="info-box">
        <p><strong>Borrower:</strong> ${borrowerEmail}</p>
        <p><strong>Proposed Date & Time:</strong><br>${formattedDate}</p>
        <p><strong>Duration:</strong> ${duration} minutes</p>
      </div>
      <p>The borrower will receive an invitation to confirm this meeting. You will receive the final meeting link once the borrower confirms.</p>
    </div>
    <div class="footer">
      <p>Thank you for using KratosAI.</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info('✅ Meeting notification email sent to lender', { to: lenderEmail });
    return true;
  } catch (error) {
    logger.error('❌ Failed to send meeting notification email to lender', error);
    return false;
  }
};
