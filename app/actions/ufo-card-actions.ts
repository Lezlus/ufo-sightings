"use server";
import { db } from "@/lib";
import { ufoCardArrayValidationSchema,ufoCardValidationSchema } from "@/types";
import type { UfoCardType, UfoCardTypeArray } from "@/types";
import fs from 'fs';
import { openai } from "@/lib";
import { toFile } from "openai";

export async function getUfoCards(): Promise<UfoCardTypeArray> {
  const { data, error } = await db
    .from("ufo_cards")
    .select("*")
    .order("id", { ascending: true });
  if (error) {
    console.log("Error Retrieving Data");
  }
  const parsedData = await ufoCardArrayValidationSchema.parseAsync(data);
  return parsedData;
}

export async function getUfoCard(id: string) {
  const { data, error } = await db
    .from('ufo_cards')
    .select()
    .eq('id', Number(id))
    .single()
  const parsedData = await ufoCardValidationSchema.parseAsync(data);
  return parsedData;
}

export async function getAudioCaptions(audioFilePath: string) {
  const response = await fetch(audioFilePath);
  if (!response.ok) throw new Error(`Failed To Fetch Audio ${audioFilePath}`);
  const arrayBuffer = await response.arrayBuffer();
  const file = await toFile(Buffer.from(arrayBuffer), 'audio.mp3', {
    type: 'audio/mpeg'
  });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1'
  });
  return transcription.text;
}