
import { z } from "zod";

export const ministryFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  meetingDay: z.string().optional(),
  image: z.any().optional(),
  leaderIds: z.array(z.string()).optional(),
  viceLeaderIds: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
});

export type MinistryFormData = z.infer<typeof ministryFormSchema>;
