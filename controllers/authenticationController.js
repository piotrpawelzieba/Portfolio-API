import jwt from 'jwt-simple';
import User from '../models/User';
import { secret } from '../dbConfig';

const tokenForUser = ({ id }) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: id, iat: timestamp }, secret);
};

export const signin = (req, res) => {
  res.send({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: 'You must provide email and password' });
  }

  User.findOne({ email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    const user = new User({ email, password });

    user.save(saveErr => {
      if (saveErr) return next(saveErr);

      res.json({ token: tokenForUser(user) });
    });
  });
};
