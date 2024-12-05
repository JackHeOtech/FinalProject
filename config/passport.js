const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy; //Implementing strategies for each authentication strategy and allowing for redirection
const User = require('../models/User');

passport.use(
  new LocalStrategy(async (username, password, done) => { //Checks against the username and password created by the user in the mongodb database
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: 'User not found' }); //If the username and password aren't found in the database, return an error

      const isMatch = await user.isValidPassword(password);
      if (!isMatch) return done(null, false, { message: 'Invalid password' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.use( //Third party strategies
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, //Retrieves the previously created client ID and secret from the .env file
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, //The client ID and client Secret are provided when you register with the specific service, this code checks that your ID and secret match
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id }); //This searches for the user through their client ID

        if (!user) {
          user = new User({
            username: profile.displayName, //If no account was created (no registration) then a new account and client ID is created
            googleId: profile.id,
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID, //Same process as explained above
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
          user = new User({
            username: profile.displayName,
            facebookId: profile.id,
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          user = new User({
            username: profile.username,
            githubId: profile.id,
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize User
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;