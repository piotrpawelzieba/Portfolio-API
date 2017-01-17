const jwt = require('jwt-simple');
const User = require('../models/User');
const {secret} = require('../dbConfig');

const tokenForUser = ({id}) => {
    const timestamp = new Date().getTime();
    return jwt.encode({sub: id, iat: timestamp}, secret);
}

exports.signin = (req, res, next) => {
    res.send({ token: tokenForUser(req.user)});
}

exports.signup = (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(422).send({ error: 'You must provide email and password'});
    }

    User.findOne({ email }, (err, existingUser) => {
        if (err) { return next(err); }


        if (existingUser) 
            return res.status(422).send({ error: 'Email is in use' });

        const user = new User({ email, password });

        user.save(function(err) {
            if (err) 
                return next(err);
            
            res.json({ token: tokenForUser(user) });
        });
    });

}