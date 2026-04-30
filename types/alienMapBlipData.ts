import { z } from 'zod'
import { GeoJsonProperties } from 'geojson'

export const AlienMapBlipValidationSchema = z.object({
  id: z.number(),
  dt: z.string(),
})

export const validateAlienMapBlipSchema = (input: GeoJsonProperties) => {
  const data = AlienMapBlipValidationSchema.parse(input);
  return data;
}