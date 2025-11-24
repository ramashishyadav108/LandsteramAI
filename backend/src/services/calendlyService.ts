import axios from 'axios';
import { logger } from '../utils/logger.js';
import { AppError } from '../middlewares/errorHandler.js';
import { HTTP_STATUS } from '../constants/index.js';

const CALENDLY_API_BASE = 'https://api.calendly.com';

interface CalendlyEventType {
  uri: string;
  name: string;
  active: boolean;
  slug: string;
  scheduling_url: string;
  duration: number;
}

interface CalendlyInvitee {
  email: string;
  name?: string;
}

interface CreateMeetingParams {
  eventTypeUri: string;
  startTime: string; // ISO 8601 format
  invitees: CalendlyInvitee[];
}

interface CalendlyMeetingResponse {
  resource: {
    uri: string;
    booking_url: string;
    owner: string;
    owner_type: string;
  };
}

interface CalendlyEventTypesResponse {
  collection: CalendlyEventType[];
  pagination: {
    count: number;
    next_page?: string;
    previous_page?: string;
  };
}

/**
 * Get access token for Calendly API using OAuth 2.0 client credentials flow
 * Note: In production, you should implement proper OAuth flow with authorization code
 */
export async function getCalendlyAccessToken(): Promise<string> {
  try {
    // For now, we'll use a placeholder. In production, implement OAuth flow
    // This should be stored in database after user authorizes
    const accessToken = process.env.CALENDLY_ACCESS_TOKEN;

    if (!accessToken) {
      throw new AppError(
        'Calendly access token not configured. Please authenticate with Calendly first.',
        HTTP_STATUS.SERVICE_UNAVAILABLE
      );
    }

    return accessToken;
  } catch (error) {
    logger.error('Failed to get Calendly access token', error);
    throw error;
  }
}

/**
 * Get all event types from Calendly
 */
export async function getCalendlyEventTypes(): Promise<CalendlyEventType[]> {
  try {
    const accessToken = await getCalendlyAccessToken();

    const response = await axios.get<CalendlyEventTypesResponse>(
      `${CALENDLY_API_BASE}/event_types`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          organization: await getOrganizationUri(accessToken),
        },
      }
    );

    logger.info('Fetched Calendly event types', {
      count: response.data.collection.length,
    });

    return response.data.collection;
  } catch (error) {
    logger.error('Failed to fetch Calendly event types', error);
    if (axios.isAxiosError(error)) {
      throw new AppError(
        `Calendly API error: ${error.response?.data?.message || error.message}`,
        error.response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
    throw error;
  }
}

/**
 * Get organization URI for the authenticated user
 */
async function getOrganizationUri(accessToken: string): Promise<string> {
  try {
    const response = await axios.get(`${CALENDLY_API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const organizationUri = response.data.resource.current_organization;
    logger.debug('Retrieved organization URI', { organizationUri });

    return organizationUri;
  } catch (error) {
    logger.error('Failed to get organization URI', error);
    throw error;
  }
}

/**
 * Create a scheduled meeting in Calendly
 * Note: Calendly API doesn't support creating scheduled events directly via API.
 * This is a limitation of Calendly's API.
 *
 * Instead, we need to:
 * 1. Generate a scheduling link
 * 2. Use webhooks to track when meetings are scheduled
 *
 * For now, this function will create an invitee (schedule on behalf of someone)
 */
export async function createCalendlyMeeting(
  params: CreateMeetingParams
): Promise<CalendlyMeetingResponse> {
  try {
    const accessToken = await getCalendlyAccessToken();

    // Note: Calendly doesn't support direct event creation via API
    // We need to use the scheduling page or one-off meeting links
    // For this implementation, we'll use the one-off meeting approach

    const response = await axios.post<CalendlyMeetingResponse>(
      `${CALENDLY_API_BASE}/scheduling_links`,
      {
        max_event_count: 1,
        owner: params.eventTypeUri,
        owner_type: 'EventType',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    logger.info('Created Calendly scheduling link', {
      eventType: params.eventTypeUri,
      invitees: params.invitees.length,
      bookingUrl: response.data.resource.booking_url,
    });

    return response.data;
  } catch (error) {
    logger.error('Failed to create Calendly meeting', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      const errorDetails = error.response?.data?.details || '';
      logger.error('Calendly API error details', {
        status: error.response?.status,
        message: errorMessage,
        details: errorDetails,
      });
      throw new AppError(
        `Failed to schedule meeting: ${errorMessage}`,
        error.response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
    throw error;
  }
}

/**
 * Get owner URI (user URI) for the authenticated user
 */
// @ts-ignore - Function kept for future use
async function getOwnerUri(accessToken: string): Promise<string> {
  try {
    const response = await axios.get(`${CALENDLY_API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const userUri = response.data.resource.uri;
    logger.debug('Retrieved owner URI', { userUri });

    return userUri;
  } catch (error) {
    logger.error('Failed to get owner URI', error);
    throw error;
  }
}

/**
 * Get scheduled event details from Calendly
 */
export async function getCalendlyEvent(eventUri: string): Promise<CalendlyMeetingResponse> {
  try {
    const accessToken = await getCalendlyAccessToken();

    const response = await axios.get<CalendlyMeetingResponse>(eventUri, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    logger.info('Fetched Calendly event', { eventUri });
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch Calendly event', error);
    if (axios.isAxiosError(error)) {
      throw new AppError(
        `Calendly API error: ${error.response?.data?.message || error.message}`,
        error.response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
    throw error;
  }
}

/**
 * Cancel a scheduled event in Calendly
 */
export async function cancelCalendlyEvent(eventUri: string, reason?: string): Promise<void> {
  try {
    const accessToken = await getCalendlyAccessToken();

    await axios.post(
      `${eventUri}/cancellation`,
      {
        reason: reason || 'Canceled by user',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    logger.info('Canceled Calendly event', { eventUri, reason });
  } catch (error) {
    logger.error('Failed to cancel Calendly event', error);
    if (axios.isAxiosError(error)) {
      throw new AppError(
        `Failed to cancel meeting: ${error.response?.data?.message || error.message}`,
        error.response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
    throw error;
  }
}

/**
 * Find the "KratosAI" event type from the list
 */
export async function getKratosAIEventType(): Promise<CalendlyEventType | null> {
  try {
    const eventTypes = await getCalendlyEventTypes();
    const kratosAIEvent = eventTypes.find(
      (eventType) => eventType.name === 'KratosAI' && eventType.active
    );

    if (!kratosAIEvent) {
      logger.warn('KratosAI event type not found or not active');
      return null;
    }

    logger.info('Found KratosAI event type', { uri: kratosAIEvent.uri });
    return kratosAIEvent;
  } catch (error) {
    logger.error('Failed to get KratosAI event type', error);
    throw error;
  }
}
