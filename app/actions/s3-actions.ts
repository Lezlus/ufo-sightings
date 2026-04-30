import { s3Client } from "@/lib";
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

const getListObjV2 = (prefix: string, delimiter: string | undefined = undefined) => {
  return new ListObjectsV2Command({
    Bucket: 'alien-map-s3',
    Prefix: prefix,
    Delimiter: delimiter
  })
}

export async function getAudioPageFiles() {
  try {
    const command = getListObjV2("audio-recordings-page/", "/");
    const response = await s3Client.send(command);

    const fileDirs = response.CommonPrefixes?.map(p => p.Prefix);
    const ufo_audio_page_data = [];
    if (fileDirs && fileDirs.every(dir => dir !== undefined)) {
      for (const dir of fileDirs) {
        const v2Command = getListObjV2(dir);
        const response = await s3Client.send(v2Command);
        const files = response.Contents?.map(file => file.Key);
        files?.shift();
        if (files && files.every(file => file !== undefined)) {
          ufo_audio_page_data.push(files);
        }
      }
    }
    return ufo_audio_page_data;
  } catch (err) {
    console.log("Error", err);
  }
}
