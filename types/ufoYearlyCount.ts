import { number, z } from 'zod';

export const UfoYearlyCountValidationSchema = z.object({
  count: z.number(),
  year: z.number(),
})

export const UfoYerlyCountArrayValidationSchema = z.array(UfoYearlyCountValidationSchema);
type UfoYearlyCountArray = z.infer<typeof UfoYerlyCountArrayValidationSchema>;
type UfoYearlyCountType = z.infer<typeof UfoYearlyCountValidationSchema>; 
export type { UfoYearlyCountArray };
export type { UfoYearlyCountType };