const express = require('express');
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

const clientID = 'd623ebfa-820c-49ad-93d6-882c814a087f';
const clientSecret = '51c0a154-38dc-475e-9f1f-f68724cb296b';
const tenantID = 'f0b08376-6d02-45d9-af3a-3020a70e1c35';
const redirectURI = 'https://neom-show-legend-app-dev.azurewebsites.net/.auth/login/aad/callback';
const scope = 'https://graph.microsoft.com/.default';

// configure passport middleware
passport.use(new OIDCStrategy({
    identityMetadata: `https://login.microsoftonline.com/${tenantID}/.well-known/openid-configuration`,
    clientID: clientID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: redirectURI,
    allowHttpForRedirectUrl: true,
    clientSecret: clientSecret,
    validateIssuer: true,
    passReqToCallback: false,
    scope: scope
},
function(iss, sub, profile, accessToken, refreshToken, done) {
    // this function is called after the user has successfully authenticated with Azure AD
    // you can add any additional logic here
    return done(null, profile);
}));

// configure cookie parser middleware
app.use(cookieParser());

// define routes
app.get('/', (req, res) => {
    // check if the user is authenticated
    if (req.isAuthenticated()) {
        // if the user is authenticated, display a welcome message with the user's display name
        res.send(`Welcome, ${req.user._json.displayName}!`);
    } else {
        // if the user is not authenticated, redirect to the login page
        res.redirect('/login');
    }
});

app.get('/login', (req, res, next) => {
    // authenticate the user using the Azure AD strategy
    passport.authenticate('azuread-openidconnect', { prompt: 'login' })(req, res, next);
});

app.get('/logout', (req, res) => {
    // log out the user and redirect to the home page
    req.logout();
    res.redirect('/');
});

app.post('/.auth/login/aad/callback',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/', failureFlash: true }),
    (req, res) => {
        // redirect to the home page after successful authentication
        res.redirect('/');
    }
);

// define a middleware to check if the user is authenticated
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        // if the user is authenticated, call the next middleware
        return next();
    }

    // if the user is not authenticated, redirect to the login page
    res.redirect('/login');
};

app.get('/profile', ensureAuthenticated, (req, res) => {
    // display the user's profile information
    res.send(`Hello, ${req.user._json.displayName}! Your email address is ${req.user._json.email}.`);
});

// start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});