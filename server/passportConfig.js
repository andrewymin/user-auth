import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },

  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    return cb(null, profile);
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //     return cb(err, user);
    //   });
  }
));

// passport.serializeUser((user, done)=>{
//   done(null, user)
// });
// passport.deserializeUser((user, done)=>{
//   done(null, user)
// });