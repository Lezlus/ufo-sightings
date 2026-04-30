import { createClient } from "@supabase/supabase-js";
import fs from 'fs';
import { z } from "zod";

const UfoBlipSchema = z.object({
  properties: z.object({
    id: z.number(),
    dt: z.string(),
    du: z.string(),
    c: z.string(),
    s: z.string(),
    t: z.string(),
  }),
  geometry: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()])
  }),
  type: z.literal("Feature")
})

type UfoBlipType = z.infer<typeof UfoBlipSchema>;


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
)

async function uploadData() {
  const fileData = fs.readFileSync(`${import.meta.dirname}/data/ufoGeoJson.json`, 'utf-8');
  const json = JSON.parse(fileData);

  const rows = json.features.map((f: UfoBlipType) => ({
    pinpoint_id: f.properties.id,
    date: f.properties.dt,
    duration: f.properties.du,
    city: f.properties.c,
    state: f.properties.s,
    text: f.properties.t,
    long: f.geometry.coordinates[0],
    lat: f.geometry.coordinates[1],
  }));

  const chunkSize = 1000;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } =  await supabase
      .from("ufo_pinpoints")
      .insert(chunk);
    
      if (error) {
        console.error(`Error uploading chunk ${i}: `, error);
        break;
      } else {
        console.log(`Uploaded ${i + chunk.length} / ${rows.length} rows`);
      }
  }
  console.log("Done");
}

uploadData();