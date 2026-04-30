import { z } from 'zod';

export const ufoCardValidationSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  audio_url: z.string(),
  image_url: z.string(),
  title: z.string(),
  description: z.string(),
});

export const ufoCardArrayValidationSchema = z.array(ufoCardValidationSchema);

type UfoCardType = z.infer<typeof ufoCardValidationSchema>;
type UfoCardTypeArray = z.infer<typeof ufoCardValidationSchema>[];

export type { UfoCardType, UfoCardTypeArray };