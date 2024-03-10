import fs from 'fs';
import images from "./src/Data/image-paths.json" assert { type: 'json' };

try {
  [images[1], images[2], images[3], images[4], images[5], images[6]].forEach(image => {
    fs.unlinkSync("./public/images/" + image);
    console.log(`File ${image} is deleted.`); 
  })
} catch (err) {
  console.error(err);
}