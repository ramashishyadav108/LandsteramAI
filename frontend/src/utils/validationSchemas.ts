import { z } from 'zod';

// Lead validation schema
export const createLeadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  contactPerson: z.string().optional(),
  companyName: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === '') return true;
        // Email regex that requires domain extension
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val);
      },
      {
        message: 'Invalid email. Please enter a valid email address (e.g., user@example.com)',
      }
    ),
  phone: z.string().optional(),
  source: z.enum(['WEBSITE', 'REFERRAL', 'LINKEDIN', 'COLD_CALL', 'EMAIL_CAMPAIGN', 'TRADE_SHOW', 'PARTNER', 'OTHER']).optional(),
  sourceDetails: z.string().optional(),
  leadType: z.enum(['INDIVIDUAL', 'BUSINESS', 'CORPORATE', 'GOVERNMENT']).optional(),
  leadPriority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['NEW', 'KNOCKOUT_FAILED', 'MEETING_SCHEDULED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST']).optional(),
  industry: z.string().optional(),
  dealValue: z
    .number()
    .positive('Deal Value must be a positive number')
    .optional()
    .or(z.undefined()),
  notes: z.string().optional(),
  assignedRM: z.string().optional(),
});

export const updateLeadSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  contactPerson: z.string().optional(),
  companyName: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val);
      },
      {
        message: 'Invalid email. Please enter a valid email address (e.g., user@example.com)',
      }
    ),
  phone: z.string().optional(),
  source: z.enum(['WEBSITE', 'REFERRAL', 'LINKEDIN', 'COLD_CALL', 'EMAIL_CAMPAIGN', 'TRADE_SHOW', 'PARTNER', 'OTHER']).optional(),
  sourceDetails: z.string().optional(),
  leadType: z.enum(['INDIVIDUAL', 'BUSINESS', 'CORPORATE', 'GOVERNMENT']).optional(),
  leadPriority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['NEW', 'KNOCKOUT_FAILED', 'MEETING_SCHEDULED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST']).optional(),
  industry: z.string().optional(),
  dealValue: z
    .number()
    .positive('Deal Value must be a positive number')
    .optional()
    .or(z.undefined()),
  notes: z.string().optional(),
  assignedRM: z.string().optional(),
});

export type CreateLeadFormData = z.infer<typeof createLeadSchema>;
export type UpdateLeadFormData = z.infer<typeof updateLeadSchema>;
