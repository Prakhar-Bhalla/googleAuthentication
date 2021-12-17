require("dotenv").config();
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const jwt = require('jsonwebtoken');

const passport = require("passport"); 

const {uuid} = require("uuidv4");

const User = require("../models/user.model");

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:2900/auth/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    let user = await User.findOne({email : profile?._json?.email}).lean().exec();
    if(!user)
    {
      user = await User.create({
        name : profile?._json?.name,
        email : profile?._json?.email,
        password : uuid()
      });
    } 
    const token = jwt.sign({ user : user }, process.env.TOKEN_KEY);

      return done(null, {user, token});
  }
));

module.exports = passport;