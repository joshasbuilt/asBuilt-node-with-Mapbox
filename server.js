const express = require('express');
const path = require('path');
//const frameguard = require('frameguard');
const app = express();
const port = 3000;
const rootDirectoryPath = path.join(__dirname);



const passport = require('passport');
const AzureAdOAuth2Strategy = require('./AzureAdOAuth2Strategy');


const config = {
    clientID: 'f0b08376-6d02-45d9-af3a-3020a70e1c35',
    clientSecret: '51c0a154-38dc-475e-9f1f-f68724cb296b',
    identityMetadata: 'https://login.microsoftonline.com/f0b08376-6d02-45d9-af3a-3020a70e1c35/v2.0/.well-known/openid-configuration',
    redirectUrl: 'https://neom-show-legend-app-dev.azurewebsites.net/.auth/login/aad/callback'
};

const strategy = new AzureAdOAuth2Strategy(config, (accessToken, refresh_token, params, profile, done) => {
    // Handle the callback from the Microsoft Identity platform
    // and return a user object or an error
});


strategy.name = 'local';

passport.use(strategy);





app.use(express.static(rootDirectoryPath));


app.get('/auth/openid', passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }));

app.get('/auth/openid/return', passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }), (req, res) => {
    // Redirect to the home page after successful authentication
    res.redirect('/');
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


app.get('/', passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }), (req, res) => {
  // Render the home page for authenticated users
  res.render(__dirname + '/index.html');
});


// app.get('/', (req, res) => {
//   // You can also build the authCodeUrlParameters object directly in the JavaScript file like this
//   // res.setHeader('Content-Security-Policy', "default-src *");
//   res.sendFile(__dirname + '/index.html');
// });




app.get('/hello', (req, res) => {
  // res.setHeader('Content-Security-Policy', "default-src *");
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});