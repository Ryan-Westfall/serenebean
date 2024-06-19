import fs from 'fs';

const imageFoler = "./public/images/"

const imagePaths = fs.readdirSync(imageFoler).map(fileName => {
    return fileName;
  });

// Function to shuffle array in place
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Shuffle the imagePaths array
shuffleArray(imagePaths);

const newImageData = {
    1: imagePaths[0],
    2: imagePaths[1],
    3: imagePaths[2],
    4: imagePaths[3],
    5: imagePaths[4],
    6: imagePaths[5],
}

const jsonData = JSON.stringify(newImageData)
fs.writeFileSync("./src/Data/image-paths.json", jsonData,  'utf8');