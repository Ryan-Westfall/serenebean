import "dotenv/config";
import { Midjourney } from "freezer-midjourney-api";
import generate from './generate-prompts.json';
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';

async function downloadFile(fileUrl: string, outputPath: string): Promise<void> {
  try {
      const response: AxiosResponse = await axios({
          method: 'GET',
          url: fileUrl,
          responseType: 'stream',
      });

      const writer = fs.createWriteStream(outputPath);

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
      });
  } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
  }
}

async function generateImage(prompt: string, client: Midjourney) {
     const Imagine = await client.Imagine(
      "Realistic, " + prompt,
      (uri: string, progress: string) => {
        console.log("loading", uri, "progress", progress);
      }
    );

    if (!Imagine) {
      console.log("no message");
      return;
    }

    const U1CustomID = Imagine.options?.find((o) => o.label === "U1")?.custom;
    if (!U1CustomID) {
      console.log("no U1");
      return;
    }

    const upscaledImage = await client.Custom({
    msgId: <string>Imagine.id,
    flags: Imagine.flags,
    customId: U1CustomID,
    loading: (uri: string, progress: string) => {
      console.log("loading", uri, "progress", progress);
    },
  });

  if (!upscaledImage) {
    console.log("no Upscale");
    return;
  }

  downloadFile(upscaledImage.uri, `./generated-images/image${upscaledImage.id}.png`)
    .then(() => console.log('Download completed successfully.'))
    .catch((error) => console.error('Download failed:', error));
}

async function main() {
  const client = new Midjourney({
    ServerId: "",
    ChannelId: "",
    SalaiToken: "",
    Ws: true,
    ApiInterval: 16000
  }); 

  await client.Connect();

  for (const prompt of generate.prompts) {
    await generateImage(prompt, client);
}
  await client.Close();
}

main()
