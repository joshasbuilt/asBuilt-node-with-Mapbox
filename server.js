const express = require('express');
const path = require('path');
//const frameguard = require('frameguard');
const app = express();
const port = 3000;
const rootDirectoryPath = path.join(__dirname);


const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;


passport.use(new OIDCStrategy({
  identityMetadata: 'https://login.microsoftonline.com/f0b08376-6d02-45d9-af3a-3020a70e1c35/v2.0/.well-known/openid-configuration',
  clientID: 'd623ebfa-820c-49ad-93d6-882c814a087f',
  clientSecret: '51c0a154-38dc-475e-9f1f-f68724cb296b',
  responseType: 'code',
  responseMode: 'form_post',
  redirectUrl: 'https://neom-show-legend-app-dev.azurewebsites.net/.auth/login/aad/callback',
  scope: ['openid', 'profile'],
  passReqToCallback: false
}, (iss, sub, profile, accessToken, refreshToken, done) => {
  return done(null, profile);
}));


// passport.use(new OIDCStrategy({
//   identityMetadata: 'https://login.microsoftonline.com/f0b08376-6d02-45d9-af3a-3020a70e1c35/v2.0/.well-known/openid-configuration',
//   clientID: 'd623ebfa-820c-49ad-93d6-882c814a087f',
//   clientSecret: '51c0a154-38dc-475e-9f1f-f68724cb296b',
//   responseType: 'code',
//   responseMode: 'form_post',
//   // redirectUrl: 'http://localhost:3000/auth/callback',
//   redirectUrl: 'https://neom-show-legend-app-dev.azurewebsites.net/.auth/login/aad/callback',
//   allowHttpForRedirectUrl: true,
//   scope: ['openid', 'profile', 'email']
// }, (iss, sub, profile, accessToken, refreshToken, done) => {
//   // handle authentication and user profile data here
//   done(null, profile);
// }));

//app.get('/auth', passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }));
app.use(passport.initialize());

app.get('/login', passport.authenticate('azuread-openidconnect'));

app.get('/.auth/login/aad/callback', passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/');
});

app.use(express.static(rootDirectoryPath));
//app.use(frameguard({ action: 'allow-from', domain: 'https://neom.asbuiltvault.com' }));
// app.use((req, res, next) => {
//   res.setHeader('Content-Security-Policy', "default-src *");
//   next();
// });


// app.use((req, res, next) => {
//   res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://neom.asbuiltvault.com");
//   res.setHeader('X-Frame-Options', 'https://neom.asbuiltvault.com');
//   next();
// });



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


 