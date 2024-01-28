import fs from 'fs';

const imageFoler = "./public/images/"

const imagePaths = fs.readdirSync(imageFoler).map(fileName => {
    return fileName;
  });

const newImageData = {
    1: imagePaths[0],
    2: imagePaths[1],
    3: imagePaths[2],
    4: imagePaths[3],
    5: imagePaths[4]
}

const jsonData = JSON.stringify(newImageData)
fs.writeFileSync("./src/Data/image-paths.json", jsonData,  'utf8');