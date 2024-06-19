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
      prompt + " --ar 2:3",
      (uri: string, progress: string) => {
        console.log("loading", uri, "progress", progress);
      }
    );

    if (!Imagine) {
      console.log("no message");
      return;
    }

    console.log('Upscaling 1')
    const U1CustomID = Imagine.options?.find((o) => o.label === "U1")?.custom;
    if (!U1CustomID) {
      console.log("no U1");
      return;
    }

    const upscaledImage1 = await client.Custom({
    msgId: <string>Imagine.id,
    flags: Imagine.flags,
    customId: U1CustomID,
    loading: (uri: string, progress: string) => {
      console.log("loading", uri, "progress", progress);
    },
  });

  if (!upscaledImage1) {
    console.log("no Upscale");
    return;
  }

  await downloadFile(upscaledImage1.uri, `./generated-images/image${upscaledImage1.id}.png`)
    .then(() => console.log('Download completed successfully.'))
    .catch((error) => console.error('Download failed:', error));

    console.log('Upscaling 2')
    const U2CustomID = Imagine.options?.find((o) => o.label === "U2")?.custom;
    if (!U2CustomID) {
      console.log("no U1");
      return;
    }

    const upscaledImage2 = await client.Custom({
    msgId: <string>Imagine.id,
    flags: Imagine.flags,
    customId: U2CustomID,
    loading: (uri: string, progress: string) => {
      console.log("loading", uri, "progress", progress);
    },
  });

  if (!upscaledImage2) {
    console.log("no Upscale");
    return;
  }

  await downloadFile(upscaledImage2.uri, `./generated-images/image${upscaledImage2.id}.png`)
    .then(() => console.log('Download completed successfully.'))
    .catch((error) => console.error('Download failed:', error));

    console.log('Upscaling 3')
    const U3CustomID = Imagine.options?.find((o) => o.label === "U3")?.custom;
    if (!U3CustomID) {
      console.log("no U1");
      return;
    }

    const upscaledImage3 = await client.Custom({
    msgId: <string>Imagine.id,
    flags: Imagine.flags,
    customId: U3CustomID,
    loading: (uri: string, progress: string) => {
      console.log("loading", uri, "progress", progress);
    },
  });

  if (!upscaledImage3) {
    console.log("no Upscale");
    return;
  }

  await downloadFile(upscaledImage3.uri, `./generated-images/image${upscaledImage3.id}.png`)
    .then(() => console.log('Download completed successfully.'))
    .catch((error) => console.error('Download failed:', error));

    console.log('Upscaling 4') 
    const U4CustomID = Imagine.options?.find((o) => o.label === "U4")?.custom;
    if (!U4CustomID) {
      console.log("no U1");
      return;
    }

    const upscaledImage4 = await client.Custom({
    msgId: <string>Imagine.id,
    flags: Imagine.flags,
    customId: U4CustomID,
    loading: (uri: string, progress: string) => {
      console.log("loading", uri, "progress", progress);
    },
  });

  if (!upscaledImage4) {
    console.log("no Upscale");
    return;
  }

  await downloadFile(upscaledImage4.uri, `./generated-images/image${upscaledImage4.id}.png`)
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
