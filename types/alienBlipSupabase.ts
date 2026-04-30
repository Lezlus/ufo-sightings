import { z } from 'zod'
import type { StringObject } from './index'

export const AlienBlipSupabaseValidationSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  date: z.string(),
  duration: z.string(),
  city: z.string(),
  text: z.string(),
  state: z.string(),
  pinpoint_id: z.number(),
  lat: z.string(),
  long: z.string(),
})

export const validateAlienBlipSupabaseSchema = async (input: StringObject) => {
  const data = await AlienBlipSupabaseValidationSchema.parseAsync(input);
  return data;
}

type AlienBlipSupabaseType = z.infer<typeof AlienBlipSupabaseValidationSchema>;
export type { AlienBlipSupabaseType }