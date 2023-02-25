const express = require('express');
const path = require('path');
//const frameguard = require('frameguard');
const app = express();
const port = 3000;




const rootDirectoryPath = path.join(__dirname);

app.use(express.static(rootDirectoryPath));
//app.use(frameguard({ action: 'allow-from', domain: 'https://neom.asbuiltvault.com' }));
// app.use((req, res, next) => {
//   res.setHeader('Content-Security-Policy', "default-src *");
//   next();
// });


app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://neom.asbuiltvault.com");
  res.setHeader('X-Frame-Options', 'https://neom.asbuiltvault.com');
  next();
});

// app.use(helmet({
//   frameguard: {
//     action: 'allow-from',
//     domain: 'https://neom.asbuiltvault.com' // Replace this with the domain you want to allow if you're using 'allow-from' option
//   }
// }));

// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       frameAncestors: ["'self'", "https://neom.asbuiltvault.com"]
//     }
//   }
// }));

app.get('/images', (req, res) => {
  fs.readdir(rootDirectoryPath, (error, files) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    }
    
    const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));
    let html = '';
    imageFiles.forEach(file => {
      html += `<img src="/${file}" alt="${file}">`;
    });
    res.send(html);
  });
});


app.get('/', (req, res) => {
  // res.setHeader('Content-Security-Policy', "default-src *");
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


 