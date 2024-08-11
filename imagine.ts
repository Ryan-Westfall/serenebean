/* eslint-disable @remotion/deterministic-randomness */
import "dotenv/config";
import { Midjourney } from "midjourney";
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import dotenv from "dotenv";
import OpenAI from "openai";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { bundle } from "@remotion/bundler";
import path from 'path';
import { staticFile } from "remotion";
import puppeteer from 'puppeteer';
import prompts from './prompts.json'

dotenv.config();

type Imagine = {
	videoTitle: string;
	videoDescription: string;
	tags: string[];
  prompts: string[];
  backgroundColorHexidecimal: string;
};


const inputPrompt = `
We are a youtube channel that generates 6 different images for our audience to then choose their favorite image. The 6 images will have a general theme among them. We need a image generation prompt for each of these 6 images to match the theme of the title.

Create a video based on the concept: ${prompts.title_ideas[Math.floor(Math.random() * prompts.title_ideas.length)]} 

Return a response that ONLY returns json format:

{
videoTitle: "Example Title",
videoDescription: "Example description",
prompts: ["Example prompt 1", "Example prompt 2", "Example prompt 3", "Example prompt 4", "Example prompt 5", "Example prompt 6"],
tags: ["Example tag 1", "Example tag 2", "Example tag 3", "Example tag 4", "Example tag 5", "Example tag 6", "Example tag 7"],
}
`

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

const chatgptStep = async () => {
	const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
	console.log('Calling ChatGPT');
	const completion = await openai.chat.completions.create({
		messages: [{role: 'system', content: inputPrompt}],
		model: 'gpt-4o',
	});
	console.log("Returned:  \n", completion.choices[0].message.content!);

	try {
        await fs.writeFileSync('imagine.json', completion.choices[0].message.content!);
        console.log('Success: Writing to file imagine.json');
    } catch (error) {
        console.error('Error writing to file:', error);
		process.exit(1)
    }
};

const midjourneyStep = async () => {
  console.log("Calling Midjourney")
  const fileContent = fs.readFileSync('imagine.json', 'utf8');
	const imagine: Imagine = JSON.parse(fileContent);

  console.log(imagine)
  console.log(process.env.SalaiToken,  process.env.ChannelId,process.env.ServerId )


  const client = new Midjourney({
    ServerId: "754179177581772871",
    ChannelId: "754179178252992596",
    SalaiToken: <string>process.env.SalaiToken,
    Ws: true,
    ApiInterval: 16000
  }); 

  await client.init();
 
  for (const prompt of imagine.prompts) {
    await generateImage(prompt, client);
}

  await client.Close();
}

const generateImage = async (prompt: string, client: Midjourney) => {
     const Imagine = await client.Imagine( 
      "Realistic, " + prompt + " --ar 2:3",
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

  await downloadFile(upscaledImage1.uri, `./public/images/image${upscaledImage1.id}.png`)
    .then(() => console.log('Download completed successfully.'))
    .catch((error) => console.error('Download failed:', error));
}

const createVideo = async () => {

	console.log("Creating Remotion Video")
  const imagePaths = fs.readdirSync("./public/images");
  const newImageData = Object.fromEntries(imagePaths.slice(0, 6).map((path, index) => [index + 1, path]));
  fs.writeFileSync("./src/Data/image-paths.json", JSON.stringify(newImageData), 'utf8');

	const bundleLocation = await bundle({
		entryPoint: path.resolve("./src/index.ts"),
	});
	const composition = await selectComposition({
		serveUrl: bundleLocation,
		id: "WhichImage",
	});

	let lastSeen = 0;
	await renderMedia({
		composition,
		serveUrl: bundleLocation,
		codec: "h264",
    inputProps: { videoSource: staticFile('videos/1.mp4') },
		outputLocation: `out/WhichImage.mp4`,
		onProgress: ({progress}) => {
			const progressPercent = progress * 100
			if((progressPercent) % 5 === 0 && lastSeen !== progressPercent) {
				console.log(`Rendering is ${progressPercent}% complete`);
				lastSeen = progressPercent
			}
		}
	});
}

const cleanup = () => {
  const imagePaths = fs.readdirSync("./public/images");
  if(imagePaths) {
    console.log("Removing Previously Used Images")
    imagePaths.forEach(image => {
      fs.unlinkSync("./public/images/" + image);
      console.log(`File ${image} is deleted.`); 
    })
  }
}

const uploadVideos = async () => {
  const fileContent = fs.readFileSync('imagine.json', 'utf8');
  const imagine: Imagine = JSON.parse(fileContent);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://publish.buffer.com/calendar/week');
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    //Step 1: Login
    await page.waitForSelector('#email');
    await page.type('#email', 'beantheserene@gmail.com'); 
    await page.type('#password', 'OT^2eatsBeans');
    await page.click('#login-form-submit');

    //Step 2: Close Modals
    while (true) {
        try {
          const closeButton = 'button[aria-label="Close"]';
          await page.waitForSelector(closeButton, {timeout: 5000})
          console.log('Modal detected, closing it...');
          await page.click(closeButton);
          await page.evaluate(() => {
            return new Promise(resolve => {
              setTimeout(resolve, 1000);
            });
          });
        }
        catch (err) {
          break;
        }
    }

    //Step 3: Go to upload page
    const buttonSelector = 'button[aria-controls="composer-root"]';
		await page.waitForSelector(buttonSelector);
		await page.evaluate(() => {
		return new Promise(resolve => {
			setTimeout(resolve, 2000);
		});
		});
		await page.click(buttonSelector);
		await page.waitForSelector('button[name="youtube-profile-button"]');
		// await page.click('button[name="youtube-profile-button"]');
		// await page.click('button[name="tiktok-profile-button"]');
		// await page.click('button[name="instagram-profile-button"]');

    //Step 4: Upload video
    const uploadButtonSelector = '[data-testid="composer-uploader-dropzone"]';
    await page.waitForSelector(uploadButtonSelector);
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click(uploadButtonSelector),
      ]);
    const filePath = '/Users/ryrywest/Documents/SereneBean/which-image/out/WhichImage.mp4'; 
    await fileChooser.accept([filePath]);

    //Step 5: Input video data
    const selectBodyInput = 'div[data-testid="composer-text-area"]'
    await page.waitForSelector(selectBodyInput, { visible: true });
    await page.click(selectBodyInput);
    await page.type(selectBodyInput, imagine.videoTitle+ "\n\n" + imagine.videoDescription + "\n\n" + imagine.tags.map(tag => '#' + tag.replace(/\s+/g, '_')).join(' '));
    await page.evaluate(() => {
			return new Promise(resolve => {
			setTimeout(resolve, 90000);
			});
		});
    await page.click('button[data-testid="omnibox-buttons"]');

    //Step 6: Add YouTube data
    const elementSelector = 'div.publish_youtubeIcon_X9DGY.publish_socialNetworkIcon_nlofG';
    await page.waitForSelector(elementSelector, { visible: true });
    await page.click(elementSelector);

    const inputSelector = 'input[type="text"][aria-label="Video title"].publish_input_CHPY-';
    await page.waitForSelector(inputSelector, { visible: true });
    await page.click(inputSelector);
    await page.type(inputSelector, imagine.videoTitle);

    const div2Selector = 'div.style__ButtonSelect-bufferapp-ui__sc-2ithy7-0.cgTTmJ';
    await page.waitForSelector(div2Selector, { visible: true });
    await page.click(div2Selector);

    const liSelector = 'li#SHARE_NOW.style__SelectItemStyled-bufferapp-ui__sc-mmb3ce-0.bbnMkJ';
    await page.waitForSelector(liSelector, { visible: true });
    await page.click(liSelector);

    const cssSelector = 'button[data-testid="stacked-save-buttons"]';
    await page.waitForSelector(cssSelector, { visible: true });
    await page.click(cssSelector);

    await page.evaluate(() => {
      return new Promise(resolve => {
        setTimeout(resolve, 90000);
      });
      });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

async function main() {
  await cleanup();
  await chatgptStep();
  await midjourneyStep();
  await createVideo(); 
  await uploadVideos();
}

main()