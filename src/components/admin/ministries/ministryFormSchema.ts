
import { z } from "zod";

export const ministryFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  meetingDay: z.string().optional(),
  image: z.any().optional(),
  leaderIds: z.array(z.string()).default([]),
  viceLeaders: z.array(z.string()).default([]),
  activities: z.array(z.string()).optional(),
});

export type MinistryFormData = z.infer<typeof ministryFormSchema>;
