import { z } from "zod"
import type { StringObject } from './index'

export const AlienBlipValidationSchema = z.object({
  summary: z.string(),
  city: z.string(),
  state: z.string(),
  date_time: z.string(),
  shape: z.string(),
  duration: z.string(),
  stats: z.string(),
  report_link: z.string(),
  text: z.string(),
  posted: z.string(),
  city_latitude: z.string(),
  city_longitude: z.string(),
});

export const validateAlienBlipSchema = (input: StringObject) => {
  const data = AlienBlipValidationSchema.parse(input);
  return data
}

type AlienBlipType = z.infer<typeof AlienBlipValidationSchema>;
export type { AlienBlipType }