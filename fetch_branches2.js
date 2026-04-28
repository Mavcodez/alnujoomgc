import https from 'https';
import fs from 'fs';

https.get('https://nujoomdemo.netlify.app/assets/index-cEsSwtZS.js', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    fs.writeFileSync('./downloaded.js', data);
    console.log("Downloaded " + data.length + " bytes.");
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
