const User = require('../models/user');
const config = require('../config');
const jwt = require('jwt-simple');

const tokenForUser = (user) => {
    const nowDate = new Date();
    const iat = nowDate.getTime();
    nowDate.setHours(nowDate.getHours + 2);
    const expires = nowDate.getTime();
    return jwt.encode({sub: user.id, iat, exp:expires}, config.secret);
}

module.exports.signup = (req, res, next) => {

    const {email, password} = req.body;

    if (!email || !password){
        return res.status(422).send('You must provide both an email and a password');
    }

    User.findOne({email}, (err, existingUser) => {

        if(err){
            return next(err);
        }
        if(existingUser){
            return res.status(422).send({error: `User ${email} has already been taken`});
        }

        const user = new User({
            email, password
        });

        user.save((err) => {
            if(err){
                return next(err);
            }

            // need to add auth token here
            res.json({token: tokenForUser(user)});
        });
    });
};

module.exports.signin = ({user}, res, next) => {
    res.send({token:tokenForUser(user)});
};