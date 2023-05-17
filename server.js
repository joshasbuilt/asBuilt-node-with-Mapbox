// Import the required MSAL.js library and Node.js modules
const express = require('express');
const path = require('path');

// Set up the MSAL.js configuration object


const app = express();

// Add the middleware functions to the app
// app.use(authMiddleware);
app.get('/index', function(req, res) {
  res.send(__dirname + '/index2.html');  //<-- this is the path to the file that actually works
});

app.get('/', (req, res) => {
 
  res.sendFile(__dirname + '/index2.html');

});

app.get('/legend', (req, res) => {
 //ff
  res.sendFile(__dirname + '/index.html');

});

app.get('/swiper', (req, res) => {
  //ff
   res.sendFile(__dirname + '/index2.html');
 
 });

// Start the server
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log("Sever console log.")
});