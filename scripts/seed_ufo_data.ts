import { db } from '@/lib';
import { parse } from 'csv-parse'
import fs from 'fs';
import type { AlienBlipType, } from '@/types';
import { validateAlienBlipSchema } from '@/types';
import { CollectionReference } from 'firebase-admin/firestore';

const processFile = async () => {
  const parser = fs
    .createReadStream(`${import.meta.dirname}/data/alien_sightings_cleaned.csv`)
    .pipe(parse({columns: true}));
  const blipsRef = db.collection("alien-blips") as CollectionReference<AlienBlipType>;
  let batch = db.batch();
  let count = 0;
  for await (const record of parser) {
    try {
      const alienBlip = validateAlienBlipSchema(record);
      const docRef = blipsRef.doc();
      batch.set(docRef, alienBlip);
      count++;
      if (count % 500 === 0) {
        await batch.commit();
        batch = db.batch();
        console.log(`Comitted ${count} records`);
      }
    } catch (e) {
      console.log("Error:", e);
    }
  }

  await batch.commit();
  console.log(`Finished, Added ${count} Total Records`);
}

processFile();