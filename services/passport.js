const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};


// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {

    User.findById(payload.sub, (err, user) => {
        if(err){
            return done(err, false);
        }
        if(user){
            return done(null, user);
        }
        // User not found
        done(null, false);
    });
});

const localOptions = {
    usernameField: 'email'
};
// Create Local Strategy
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    // Verify user/pass exist
    User.findOne({email}, (err, user) => {
        if(err){
            return done(err, false);
        }
        if(!user){
            return done(null, false);
        }
        user.comparePassword(password, (err, isMatch) => {
            if(err){
                return done(err, false);
            }
            if(isMatch){
                return done(null, user);
            }
            return done(null, false);
        });

    });
});

passport.use(jwtLogin);
passport.use(localLogin);
