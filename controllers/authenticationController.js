import jwt from 'jwt-simple';
import User from '../models/User';
import dbConfig from '../dbConfig';

const tokenForUser = ({ id }) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: id, iat: timestamp }, dbConfig.secret);
};

export const signin = (req, res) => {
  res.send({ token: tokenForUser(req.user) });
};

export async function signup(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(422)
        .send({ error: 'You must provide email and password' });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    const user = new User({ email, password });
    user.save();
    return res.json({ token: tokenForUser(user) });
  } catch (err) {
    return next(err);
  }
}
