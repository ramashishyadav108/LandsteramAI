import { api, ApiResponse } from './api';

export type LeadStatus = 'NEW' | 'KNOCKOUT_FAILED' | 'MEETING_SCHEDULED' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'WON' | 'LOST';
export type LeadSource = 'WEBSITE' | 'REFERRAL' | 'LINKEDIN' | 'COLD_CALL' | 'EMAIL_CAMPAIGN' | 'TRADE_SHOW' | 'PARTNER' | 'OTHER';
export type LeadType = 'INDIVIDUAL' | 'BUSINESS' | 'CORPORATE' | 'GOVERNMENT';
export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Lead {
  id: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  contactPerson?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  sourceDetails?: string;
  leadType?: LeadType;
  leadPriority: LeadPriority;
  status: LeadStatus;
  industry?: string;
  dealValue?: number;
  notes?: string;
  assignedRM?: string;
  assignedRMs?: string[];
  assignedRMDetails?: {
    id: string;
    name: string;
    email: string;
    picture?: string;
  };
  assignedRMsList?: Array<{
    id: string;
    name: string;
    email: string;
    picture?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

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
}

export interface UpdateLeadData extends Partial<CreateLeadData> {}

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  assignedRM?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface LeadStats {
  total: number;
  byStatus: Record<string, number>;
}

export interface FunnelStats {
  funnel: {
    leadsCreated: number;
    knockoutPassed: number;
    meetingsScheduled: number;
    applicationInitiated: number;
    applicationPassed: number;
  };
  conversions: {
    toMeetings: number;
    toApplications: number;
  };
  actionItems: {
    leadsToContact: number;
    leadsToKnockout: number;
  };
}

class LeadService {
  async createLead(data: CreateLeadData): Promise<ApiResponse<Lead>> {
    return api.post<Lead>('/api/leads', data);
  }

  async getAllLeads(filters?: LeadFilters): Promise<ApiResponse<Lead[]>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.source) params.append('source', filters.source);
    if (filters?.assignedRM) params.append('assignedRM', filters.assignedRM);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = queryString ? `/api/leads?${queryString}` : '/api/leads';
    return api.get<Lead[]>(url);
  }

  async getLeadById(id: string): Promise<ApiResponse<Lead>> {
    return api.get<Lead>(`/api/leads/${id}`);
  }

  async updateLead(id: string, data: UpdateLeadData): Promise<ApiResponse<Lead>> {
    return api.put<Lead>(`/api/leads/${id}`, data);
  }

  async deleteLead(id: string): Promise<ApiResponse<void>> {
    return api.delete(`/api/leads/${id}`);
  }

  async getMyLeads(): Promise<ApiResponse<Lead[]>> {
    return api.get<Lead[]>('/api/leads/my-leads');
  }

  async getLeadStats(): Promise<ApiResponse<LeadStats>> {
    return api.get<LeadStats>('/api/leads/stats');
  }

  async assignRM(leadId: string, rmUserId: string): Promise<ApiResponse<Lead>> {
    return api.put<Lead>(`/api/leads/${leadId}/assign-rm`, { assignedRM: rmUserId });
  }

  async addRM(leadId: string, rmUserId: string): Promise<ApiResponse<Lead>> {
    return api.post<Lead>(`/api/leads/${leadId}/add-rm`, { rmUserId });
  }

  async removeRM(leadId: string, rmUserId: string): Promise<ApiResponse<Lead>> {
    return api.delete<Lead>(`/api/leads/${leadId}/remove-rm/${rmUserId}`);
  }

  async getFunnelStats(): Promise<ApiResponse<FunnelStats>> {
    return api.get<FunnelStats>('/api/leads/funnel-stats');
  }

  async getApplicationOverviewStats(): Promise<ApiResponse<ApplicationOverviewStats>> {
    return api.get<ApplicationOverviewStats>('/api/leads/application-overview-stats');
  }
}

export interface ApplicationOverviewStats {
  statistics: {
    totalBorrowers: number;
    growthPercentage: number;
    underAssessment: number;
    newThisWeek: number;
    highRiskBorrowers: number;
    highRiskChange: number;
    pendingApprovals: number;
  };
  actionItems: {
    recentlyApproved: number;
    missingDocs: number;
    notScheduled: number;
    inactiveApplications: number;
  };
  recentApplications: Array<{
    id: string;
    companyName: string;
    description: string;
    status: LeadStatus;
    lastUpdated: string;
  }>;
  pipelineHealth: {
    notStarted: number;
    onTrack: number;
    atRisk: number;
    delayed: number;
    completed: number;
  };
}

export const leadService = new LeadService();
