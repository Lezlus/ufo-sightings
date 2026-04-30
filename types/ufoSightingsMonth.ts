import { z } from 'zod';

export const UfoSightingsByMonth = z.object({
  month_label: z.string(),
  sighting_count: z.number(),
});

export const UfoSightingsByMonthArrayValidationSchema = z.array(UfoSightingsByMonth);
export type UfoSightingsByMonthArrayType = z.infer<typeof UfoSightingsByMonthArrayValidationSchema>;
