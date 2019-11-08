import InventoryModule from './steamModules/inventoryModule';
import InventoryPollModule from './steamModules/inventoryPollModule';
import mongoose from 'mongoose';
import { mongoDbPath, bitskinsApiKey, bitskinsTwoFactor, steamApiKey } from './config';
import bitskinsPricingModule from './bitskinsModules/bitskinPricingModule';
import express from 'express';
import graphlHTTP from 'express-graphql';
import schema from './graphql/schema';
import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import session from 'express-session';
import { initializeUser } from './database/userActions';

const inventoryModule = new InventoryModule();
const inventoryPollModule = new InventoryPollModule();
//const bitskinsPricingMod = new bitskinsPricingModule(bitskinsApiKey, bitskinsTwoFactor);

// Connect to our db
const connect = () => {
    mongoose.connect(`mongodb://localhost/${mongoDbPath}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }, err => {
        if (err) throw err;
        console.log('Successfully connected to Db');
    });
}
connect();

// Reconnect in case of disconnect
mongoose.connection.on('disconnected', connect);

// Start express
const app = express();
const PORT = 3000;

app.use(session({
    secret: 'your secret',
    name: 'name of session id',
    resave: true,
    saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: steamApiKey
  },
  function(identifier, profile, done) {
    initializeUser(profile._json.steamid).then(user => {
        return done(null, user);
    })
  }
));

app.use('/graphql', graphlHTTP((req) => ({
    schema: schema,
    context : {
        user: req.user
    },
    graphiql: true
})));

app.get('/', function(req, res){
    res.json({ user: req.user });
});

app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    req.logout();
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});


    