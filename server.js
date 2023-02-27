const express = require('express');
const msal = require('@azure/msal-node');

const app = express();

const config = {
    auth: {
        clientId: 'f0b08376-6d02-45d9-af3a-3020a70e1c35',
        authority: 'https://login.microsoftonline.com/f0b08376-6d02-45d9-af3a-3020a70e1c35',
        clientSecret: 'https://neom-show-legend-app-dev.azurewebsites.net/.auth/login/aad/callback'
    }
};


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




const cca = new msal.ConfidentialClientApplication(config);

// Middleware function to authenticate the user
const authMiddleware = async (req, res, next) => {
    const tokenRequest = {
        scopes: ['https://neom-show-legend-app-dev.azurewebsites.net/user_impersonation']
    };

    try {
        const response = await cca.acquireTokenByClientCredential(tokenRequest);
        req.accessToken = response.accessToken;
        next();
    } catch (error) {
        res.status(500).send(error);
    }
};

// Serve the index page
app.get('/', authMiddleware, (req, res) => {
    res.send(`Access token: ${req.accessToken}`);
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
