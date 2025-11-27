import prisma from '../config/db.js';
import { LeadStatus, LeadSource, LeadType, LeadPriority } from '@prisma/client';

export interface CreateLeadData {
  firstName: string;
  middleName?: string;
  lastName?: string;
  contactPerson?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  source?: LeadSource;
  sourceDetails?: string;
  leadType?: LeadType;
  leadPriority?: LeadPriority;
  status?: LeadStatus;
  industry?: string;
  dealValue?: number;
  notes?: string;
  assignedRM?: string;
  createdById: string;
}

export interface UpdateLeadData {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  contactPerson?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  source?: LeadSource;
  sourceDetails?: string;
  leadType?: LeadType;
  leadPriority?: LeadPriority;
  status?: LeadStatus;
  industry?: string;
  dealValue?: number;
  notes?: string;
  assignedRM?: string;
}

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  assignedRM?: string;
  search?: string;
  createdById?: string;
  startDate?: string;
  endDate?: string;
}

export const createLead = async (data: CreateLeadData) => {
  return prisma.lead.create({
    data,
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getLeadById = async (id: string) => {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!lead) {
    return null;
  }

  // Parse assignedRM as JSON array if it exists and is a string
  let assignedRMsList: any[] = [];
  let assignedRMs: string[] = [];
  
  if (lead.assignedRM) {
    try {
      // Try to parse as JSON array
      assignedRMs = JSON.parse(lead.assignedRM);
      
      // Fetch details for all assigned RMs
      if (Array.isArray(assignedRMs) && assignedRMs.length > 0) {
        assignedRMsList = await prisma.user.findMany({
          where: {
            id: { in: assignedRMs },
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
      }
    } catch (e) {
      // If it's not JSON, treat it as a single RM ID (backward compatibility)
      assignedRMs = [lead.assignedRM];
      const rmUser = await prisma.user.findUnique({
        where: { id: lead.assignedRM },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      if (rmUser) {
        assignedRMsList = [rmUser];
      }
    }
  }

  // Legacy support: also return assignedRMDetails for first RM
  const assignedRMDetails = assignedRMsList.length > 0 ? assignedRMsList[0] : null;

  return {
    ...lead,
    assignedRMs,
    assignedRMsList,
    assignedRMDetails,
  };
};

export const getAllLeads = async (filters?: LeadFilters) => {
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.source) {
    where.source = filters.source;
  }

  if (filters?.assignedRM) {
    where.assignedRM = filters.assignedRM;
  }

  if (filters?.createdById) {
    where.createdById = filters.createdById;
  }

  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {};
    if (filters?.startDate) {
      where.createdAt.gte = new Date(filters.startDate);
    }
    if (filters?.endDate) {
      where.createdAt.lte = new Date(filters.endDate);
    }
  }

  if (filters?.search) {
    where.OR = [
      { firstName: { contains: filters.search, mode: 'insensitive' } },
      { lastName: { contains: filters.search, mode: 'insensitive' } },
      { companyName: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
      { contactPerson: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const leads = await prisma.lead.findMany({
    where,
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Parse assignedRM for each lead and fetch RM details
  const leadsWithRMs = await Promise.all(
    leads.map(async (lead) => {
      let assignedRMsList: any[] = [];
      let assignedRMs: string[] = [];
      
      if (lead.assignedRM) {
        try {
          // Try to parse as JSON array
          assignedRMs = JSON.parse(lead.assignedRM);
          
          // Fetch details for all assigned RMs
          if (Array.isArray(assignedRMs) && assignedRMs.length > 0) {
            assignedRMsList = await prisma.user.findMany({
              where: {
                id: { in: assignedRMs },
              },
              select: {
                id: true,
                name: true,
                email: true,
              },
            });
          }
        } catch (e) {
          // If it's not JSON, treat it as a single RM ID (backward compatibility)
          assignedRMs = [lead.assignedRM];
          const rmUser = await prisma.user.findUnique({
            where: { id: lead.assignedRM },
            select: {
              id: true,
              name: true,
              email: true,
            },
          });
          if (rmUser) {
            assignedRMsList = [rmUser];
          }
        }
      }

      return {
        ...lead,
        assignedRMs,
        assignedRMsList,
      };
    })
  );

  return leadsWithRMs;
};

export const updateLead = async (id: string, data: UpdateLeadData) => {
  return prisma.lead.update({
    where: { id },
    data,
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const deleteLead = async (id: string) => {
  return prisma.lead.delete({
    where: { id },
  });
};

export const getLeadsByUser = async (userId: string) => {
  return prisma.lead.findMany({
    where: { createdById: userId },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getLeadStats = async (userId?: string) => {
  const where = userId ? { createdById: userId } : {};

  const [total, byStatus] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.groupBy({
      by: ['status'],
      where,
      _count: true,
    }),
  ]);

  return {
    total,
    byStatus: byStatus.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {} as Record<string, number>),
  };
};

export const assignRM = async (id: string, assignedRM: string) => {
  // Get the assigned RM user details
  const rmUser = await prisma.user.findUnique({
    where: { id: assignedRM },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  // Update the lead with the assigned RM
  const lead = await prisma.lead.update({
    where: { id },
    data: { assignedRM },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Add the RM details to the response
  return {
    ...lead,
    assignedRMDetails: rmUser,
  };
};

export const addRM = async (id: string, rmUserId: string) => {
  // Get current lead
  const lead = await prisma.lead.findUnique({
    where: { id },
  });

  if (!lead) {
    throw new Error('Lead not found');
  }

  // Parse existing RMs
  let assignedRMs: string[] = [];
  if (lead.assignedRM) {
    try {
      assignedRMs = JSON.parse(lead.assignedRM);
      if (!Array.isArray(assignedRMs)) {
        assignedRMs = [lead.assignedRM];
      }
    } catch (e) {
      assignedRMs = [lead.assignedRM];
    }
  }

  // Add new RM if not already present
  if (!assignedRMs.includes(rmUserId)) {
    assignedRMs.push(rmUserId);
  }

  // Update lead with new RMs array
  await prisma.lead.update({
    where: { id },
    data: { assignedRM: JSON.stringify(assignedRMs) },
  });

  // Return updated lead with details
  return getLeadById(id);
};

export const removeRM = async (id: string, rmUserId: string) => {
  // Get current lead
  const lead = await prisma.lead.findUnique({
    where: { id },
  });

  if (!lead) {
    throw new Error('Lead not found');
  }

  // Parse existing RMs
  let assignedRMs: string[] = [];
  if (lead.assignedRM) {
    try {
      assignedRMs = JSON.parse(lead.assignedRM);
      if (!Array.isArray(assignedRMs)) {
        assignedRMs = [lead.assignedRM];
      }
    } catch (e) {
      assignedRMs = [lead.assignedRM];
    }
  }

  // Remove the RM
  assignedRMs = assignedRMs.filter(id => id !== rmUserId);

  // Update lead with new RMs array (or null if empty)
  await prisma.lead.update({
    where: { id },
    data: { 
      assignedRM: assignedRMs.length > 0 ? JSON.stringify(assignedRMs) : null 
    },
  });

  // Return updated lead with details
  return getLeadById(id);
};
