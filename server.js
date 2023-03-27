// Import the required MSAL.js library and Node.js modules
const express = require('express');
const path = require('path');

// Set up the MSAL.js configuration object


// Define the desired scope


// Define an Express.js middleware function to handle authentication

// Define an Express.js middleware function to serve the index page


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