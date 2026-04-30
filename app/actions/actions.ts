"use server";
import { validateAlienBlipSupabaseSchema, UfoYerlyCountArrayValidationSchema, UfoSightingsByMonthArrayValidationSchema } from "@/types";
import { db } from "@/lib";
import type { Filter, UfoSightingsByMonthArrayType, UfoYearlyCountArray } from "@/types";

const convertYearToUnix = (year: number) => {
  const date = new Date(Date.UTC(year, 0, 1));
  return Math.floor(date.getTime() / 1000);
};

export async function getSigtingsCountByYear(): Promise<UfoYearlyCountArray> {
  const { data, error } = await db
    .from('ufo_year_counts')
    .select("*")
  if (error) {
    console.log('error getting pre-computed ufo_year_counts view');
  }
  const parsedData = await UfoYerlyCountArrayValidationSchema.parseAsync(data);
  console.log(parsedData[parsedData.length - 1].year);
  return parsedData;
}

export async function getLocalDensity(lng: number, lat: number): Promise<number> {
  const { data, error } = await db.rpc("get_local_sighting_density", {
    "target_lat": lat,
    "target_lng": lng,
    "radius_miles": 50
  });
  return data as number ?? 0;
}

export async function getMonthlySighthingsByYear(year1: string, year2: string): Promise<UfoSightingsByMonthArrayType> {
  const { data, error } = await db.rpc('get_ufo_stats_range', {
    "year_start": year1,
    "year_end": year2
  });
  const parsedData = await UfoSightingsByMonthArrayValidationSchema.parseAsync(data);
  return parsedData;
}

export async function getSightingDetails(id: number) {
  const { data, error } = await db
    .from('ufo_pinpoints')
    .select()
    .eq('pinpoint_id', id)
    .single()

    const parsed_alien_blip_data = await validateAlienBlipSupabaseSchema(data);
    return parsed_alien_blip_data;
}

export async function getFilterCount(filterData: Filter) {
  const startYear = convertYearToUnix(filterData.startYear);
  const endYear = convertYearToUnix(filterData.endYear);

  const { count, error } = await db
    .from('ufo_pinpoints')
    .select("*", { count: "exact", head: true })
    .gte("date_unix", startYear)
    .lte("date_unix", endYear);
  
  if (error) {
    console.log("Error Applying Filters To DB")
    return 0;
  }
  console.log(count);
  return count ?? 0;
}