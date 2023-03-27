// Import the required MSAL.js library and Node.js modules
const msal = require('@azure/msal-node');
const express = require('express');
const path = require('path');

// Set up the MSAL.js configuration object
const msalConfig = {
  auth: {
    clientId: 'd623ebfa-820c-49ad-93d6-882c814a087f',
    authority: 'https://login.microsoftonline.com/f0b08376-6d02-45d9-af3a-3020a70e1c35',
    clientSecret: '51c0a154-38dc-475e-9f1f-f68724cb296b',
    redirectUri: 'https://neom-show-legend-app-dev.azurewebsites.net/.auth/login/aad/callback'

  },
};

// Define the desired scope
const scope = 'https://graph.microsoft.com/.default';

// Create an instance of the MSAL.js client
const msalClient = new msal.ConfidentialClientApplication(msalConfig);

// Define an Express.js middleware function to handle authentication
async function authMiddleware(req, res, next) {
  try {
    // Get the access token from the request headers
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // If there is no access token, redirect the user to sign in
      const authUrl = await msalClient.getAuthCodeUrl({
        scopes: [scope],
      });
      res.redirect(authUrl);
      return;
    }

    // Get the bearer token from the access token in the request headers
    const accessToken = authHeader.split(' ')[1];

    // Attach the access token to the request object for use in later middleware functions
    req.accessToken = accessToken;

    // Call the next middleware function
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
}

// Define an Express.js middleware function to serve the index page
function indexMiddleware(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
}

// Create an instance of the Express.js app
const app = express();

// Add the middleware functions to the app
// app.use(authMiddleware);
app.get('/index', function(req, res) {
  res.send(__dirname + '/index.html');
});

app.get('/', (req, res) => {
 
  res.sendFile(__dirname + '/index.html');


  

  // Use the access token to make a request to the Microsoft Graph API
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     Authorization: `Bearer ${req.accessToken}`,
  //   },
  //   url: 'https://graph.microsoft.com/v1.0/me',
  // };
  // request(options, (error, response, body) => {
  //   if (error) {
  //     console.log(error);
  //     res.sendStatus(500);
  //     return;
  //   }
  //   res.send(body);
  // });
});

// Start the server
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log("Sever console log.")
});