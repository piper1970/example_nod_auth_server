const Authentication = require('./controllers/authentication');
require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

module.exports = (app) => {

    app.get('/', requireAuth, (req, res) => {res.send("Yippee!")});

    // signin
    app.post('/signin', requireSignin, Authentication.signin);

    // main path
    app.post('/signup', Authentication.signup);
};