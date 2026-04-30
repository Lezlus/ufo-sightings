// This script is used to populate the audio and images dir on my AWS S3
// The images and audio go together so on S3 I should have the following structure
// audio-recordings/image_url_{uuid}/image and audio live here
import { s3Client } from "@/lib";
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

const getListObjV2 = (prefix: string, delimiter: string | undefined = undefined) => {
  return new ListObjectsV2Command({
    Bucket: 'alien-map-s3',
    Prefix: prefix,
    Delimiter: delimiter
  })
}

async function getAudioPageFiles() {

  try {
    const command = getListObjV2("audio-recordings-page/", "/");
    const response = await s3Client.send(command);

    const fileDirs = response.CommonPrefixes?.map(p => p.Prefix);
    // Pop first element as it is the parent directory
    // const parsedFileKeys = fileKeys?.filter(key => key !== undefined);
    // parsedFileKeys?.shift();
    // if (parsedFileKeys) {
    //   const ufoDirectories = parsedFileKeys.filter(key => key[key.length - 1] === '/');
    //   console.log(ufoDirectories);
    // }
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
    
    console.log(ufo_audio_page_data);
    return ufo_audio_page_data;
  } catch (err) {
    console.log("Error", err);
  }
}

getAudioPageFiles();