const express = require('express');
const path = require('path');
const app = express();
const port = 3000;




const rootDirectoryPath = path.join(__dirname);

app.use(express.static(rootDirectoryPath));

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src *");
  next();
});

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
  res.setHeader('Content-Security-Policy', "default-src *");
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


 