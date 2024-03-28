import "dotenv/config";
import { Midjourney } from "freezer-midjourney-api";
import generate from './src/Data/generate-prompts.json';

async function generateImage(prompt: string, client: Midjourney) {

  return new Promise<void>(resolve => {
    client.Imagine(
      "Realistic, " + prompt,
      (uri: string, progress: string) => {
        console.log("loading", uri, "progress", progress);
      }
    );  
    
    setTimeout( () => {

      resolve() 
  
    }, 5000); 
  })
}

async function main() {

  const client = new Midjourney({
    ServerId: "",
    ChannelId: "",
    SalaiToken: "",
    Debug: true,
    Ws: true,
    ApiInterval: 16000
  }); 

  await client.Connect();

  for (const prompt of generate.prompts) {
    await generateImage(prompt, client);
}
}

main()
