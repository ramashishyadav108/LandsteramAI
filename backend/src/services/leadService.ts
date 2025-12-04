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
          picture: true,
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
          picture: true,
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
            picture: true,
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
          picture: true,
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
          picture: true,
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
                picture: true,
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
              picture: true,
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
          picture: true,
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
          picture: true,
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
      picture: true,
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
          picture: true,
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

export const getFunnelStats = async (userId?: string) => {
  const where = userId ? { createdById: userId } : {};

  // Get all leads for the user
  const allLeads = await prisma.lead.findMany({
    where,
  });

  // Calculate funnel statistics
  const totalLeadsCreated = allLeads.length;

  // Knockout Passed - leads that are NOT in KNOCKOUT_FAILED or NEW status
  const knockoutPassed = allLeads.filter(
    lead => lead.status !== 'KNOCKOUT_FAILED' && lead.status !== 'NEW'
  ).length;

  // Meetings Scheduled - leads with MEETING_SCHEDULED status
  const meetingsScheduled = allLeads.filter(
    lead => lead.status === 'MEETING_SCHEDULED'
  ).length;

  // Application Initiated - leads that have progressed beyond meetings
  const applicationInitiated = allLeads.filter(
    lead => ['QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON'].includes(lead.status)
  ).length;

  // Application Passed - leads that have WON status
  const applicationPassed = allLeads.filter(
    lead => lead.status === 'WON'
  ).length;

  // Calculate conversion rates
  const conversionToMeetings = totalLeadsCreated > 0
    ? Math.round((meetingsScheduled / totalLeadsCreated) * 100)
    : 0;

  const conversionToApplications = totalLeadsCreated > 0
    ? Math.round((applicationInitiated / totalLeadsCreated) * 100)
    : 0;

  // Calculate counts for action links
  const leadsToContact = allLeads.filter(
    lead => lead.status === 'NEW'
  ).length;

  const leadsToKnockout = allLeads.filter(
    lead => lead.status === 'QUALIFIED'
  ).length;

  return {
    funnel: {
      leadsCreated: totalLeadsCreated,
      knockoutPassed,
      meetingsScheduled,
      applicationInitiated,
      applicationPassed,
    },
    conversions: {
      toMeetings: conversionToMeetings,
      toApplications: conversionToApplications,
    },
    actionItems: {
      leadsToContact,
      leadsToKnockout,
    },
  };
};

export const getApplicationOverviewStats = async (userId?: string) => {
  const where = userId ? { createdById: userId } : {};

  // Get current date for time-based calculations
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const thisWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

  // Get all leads
  const allLeads = await prisma.lead.findMany({
    where,
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          picture: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  // Get last month's leads for comparison
  const lastMonthLeads = await prisma.lead.count({
    where: {
      ...where,
      createdAt: {
        gte: lastMonth,
      },
    },
  });

  // Calculate statistics
  const totalBorrowers = allLeads.length;

  // Under Assessment - leads with statuses that indicate active review
  const underAssessment = allLeads.filter(
    lead => ['QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION'].includes(lead.status)
  ).length;

  // New this week
  const newThisWeek = allLeads.filter(
    lead => new Date(lead.createdAt) >= thisWeekStart
  ).length;

  // High-Risk Borrowers - leads that have KNOCKOUT_FAILED or LOST status
  const highRiskBorrowers = allLeads.filter(
    lead => ['KNOCKOUT_FAILED', 'LOST'].includes(lead.status)
  ).length;

  // Pending Approvals - leads with status PROPOSAL_SENT or NEGOTIATION
  const pendingApprovals = allLeads.filter(
    lead => ['PROPOSAL_SENT', 'NEGOTIATION'].includes(lead.status)
  ).length;

  // Calculate growth percentage
  const growthPercentage = lastMonthLeads > 0
    ? Math.round(((totalBorrowers - lastMonthLeads) / lastMonthLeads) * 100)
    : 0;

  // Recently approved applications (WON status in last 48 hours)
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const recentlyApproved = allLeads.filter(
    lead => lead.status === 'WON' && new Date(lead.updatedAt) >= twoDaysAgo
  ).length;

  // Missing documents - leads with NEW status
  const missingDocs = allLeads.filter(
    lead => lead.status === 'NEW'
  ).length;

  // Not scheduled for committee - leads with MEETING_SCHEDULED status
  const notScheduled = allLeads.filter(
    lead => lead.status === 'MEETING_SCHEDULED'
  ).length;

  // Inactive applications - leads not updated in last 30 days
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const inactiveApplications = allLeads.filter(
    lead => new Date(lead.updatedAt) < thirtyDaysAgo && lead.status !== 'WON' && lead.status !== 'LOST'
  ).length;

  // Recent applications for "Pick Up Where You Left"
  const recentApplications = allLeads
    .filter(lead => lead.status !== 'WON' && lead.status !== 'LOST')
    .slice(0, 3)
    .map(lead => ({
      id: lead.id,
      companyName: lead.companyName || `${lead.firstName} ${lead.lastName || ''}`.trim(),
      description: lead.notes || 'No description available',
      status: lead.status,
      lastUpdated: lead.updatedAt,
    }));

  // Pipeline health - distribution of statuses
  const statusCounts = {
    notStarted: allLeads.filter(l => l.status === 'NEW').length,
    onTrack: allLeads.filter(l => ['MEETING_SCHEDULED', 'QUALIFIED'].includes(l.status)).length,
    atRisk: allLeads.filter(l => l.status === 'KNOCKOUT_FAILED').length,
    delayed: allLeads.filter(l => new Date(l.updatedAt) < thirtyDaysAgo && l.status !== 'WON' && l.status !== 'LOST').length,
    completed: allLeads.filter(l => l.status === 'WON').length,
  };

  const total = allLeads.length || 1; // Avoid division by zero
  const pipelineHealth = {
    notStarted: Math.round((statusCounts.notStarted / total) * 100),
    onTrack: Math.round((statusCounts.onTrack / total) * 100),
    atRisk: Math.round((statusCounts.atRisk / total) * 100),
    delayed: Math.round((statusCounts.delayed / total) * 100),
    completed: Math.round((statusCounts.completed / total) * 100),
  };

  return {
    statistics: {
      totalBorrowers,
      growthPercentage,
      underAssessment,
      newThisWeek,
      highRiskBorrowers,
      highRiskChange: -3, // This could be calculated based on previous period
      pendingApprovals,
    },
    actionItems: {
      recentlyApproved,
      missingDocs,
      notScheduled,
      inactiveApplications,
    },
    recentApplications,
    pipelineHealth,
  };
};
