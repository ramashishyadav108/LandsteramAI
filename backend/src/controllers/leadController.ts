import { Request, Response, NextFunction } from 'express';
import * as leadService from '../services/leadService.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { NotFoundError } from '../middlewares/errorHandler.js';
import { LeadStatus, LeadSource } from '@prisma/client';

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const leadData = {
      ...req.body,
      createdById: userId,
      // Set current user as default RM if no assignedRM is provided
      assignedRM: req.body.assignedRM || JSON.stringify([userId]),
    };

    const lead = await leadService.createLead(leadData);
    sendCreated(res, lead, 'Lead created successfully');
  } catch (error) {
    next(error);
  }
};

export const getLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const { id } = req.params;
    const lead = await leadService.getLeadById(id);

    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    // Ensure user can only access their own leads
    if (lead.createdById !== userId) {
      throw new NotFoundError('Lead not found');
    }

    sendSuccess(res, lead);
  } catch (error) {
    next(error);
  }
};

export const getAllLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const { status, source, assignedRM, search } = req.query;

    const filters: leadService.LeadFilters = {
      createdById: userId, // Filter by current user
    };

    if (status && Object.values(LeadStatus).includes(status as LeadStatus)) {
      filters.status = status as LeadStatus;
    }

    if (source && Object.values(LeadSource).includes(source as LeadSource)) {
      filters.source = source as LeadSource;
    }

    if (assignedRM) {
      filters.assignedRM = assignedRM as string;
    }

    if (search) {
      filters.search = search as string;
    }

    const leads = await leadService.getAllLeads(filters);
    sendSuccess(res, leads);
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const { id } = req.params;

    const existingLead = await leadService.getLeadById(id);
    if (!existingLead) {
      throw new NotFoundError('Lead not found');
    }

    // Ensure user can only update their own leads
    if (existingLead.createdById !== userId) {
      throw new NotFoundError('Lead not found');
    }

    const lead = await leadService.updateLead(id, req.body);
    sendSuccess(res, lead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const { id } = req.params;

    const existingLead = await leadService.getLeadById(id);
    if (!existingLead) {
      throw new NotFoundError('Lead not found');
    }

    // Ensure user can only delete their own leads
    if (existingLead.createdById !== userId) {
      throw new NotFoundError('Lead not found');
    }

    await leadService.deleteLead(id);
    sendSuccess(res, null, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const getMyLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const leads = await leadService.getLeadsByUser(userId);
    sendSuccess(res, leads);
  } catch (error) {
    next(error);
  }
};

export const getLeadStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const stats = await leadService.getLeadStats(userId);
    sendSuccess(res, stats);
  } catch (error) {
    next(error);
  }
};

export const assignRM = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const { id } = req.params;
    const { assignedRM } = req.body;

    if (!assignedRM) {
      throw new NotFoundError('Assigned RM user ID is required');
    }

    const existingLead = await leadService.getLeadById(id);
    if (!existingLead) {
      throw new NotFoundError('Lead not found');
    }

    // Ensure user can only update their own leads
    if (existingLead.createdById !== userId) {
      throw new NotFoundError('Lead not found');
    }

    const lead = await leadService.assignRM(id, assignedRM);
    sendSuccess(res, lead, 'RM assigned successfully');
  } catch (error) {
    next(error);
  }
};

export const addRM = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const { id } = req.params;
    const { rmUserId } = req.body;

    if (!rmUserId) {
      throw new NotFoundError('RM user ID is required');
    }

    const existingLead = await leadService.getLeadById(id);
    if (!existingLead) {
      throw new NotFoundError('Lead not found');
    }

    // Ensure user can only update their own leads
    if (existingLead.createdById !== userId) {
      throw new NotFoundError('Lead not found');
    }

    const lead = await leadService.addRM(id, rmUserId);
    sendSuccess(res, lead, 'RM added successfully');
  } catch (error) {
    next(error);
  }
};

export const removeRM = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const { id, rmUserId } = req.params;

    if (!rmUserId) {
      throw new NotFoundError('RM user ID is required');
    }

    const existingLead = await leadService.getLeadById(id);
    if (!existingLead) {
      throw new NotFoundError('Lead not found');
    }

    // Ensure user can only update their own leads
    if (existingLead.createdById !== userId) {
      throw new NotFoundError('Lead not found');
    }

    const lead = await leadService.removeRM(id, rmUserId);
    sendSuccess(res, lead, 'RM removed successfully');
  } catch (error) {
    next(error);
  }
};
