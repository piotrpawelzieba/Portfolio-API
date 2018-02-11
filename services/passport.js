import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import LocalStrategy from 'passport-local';
import dbConfig from '../dbConfig';
import User from '../models/User';

const localOptions = { usernameField: 'email' };
const localStrategy = async (email, password, done) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return done(null, false);
    }

    user.comparePassword(password, (compareErr, isMatch) => {
      if (compareErr) {
        throw compareErr;
      }
      if (!isMatch) {
        return done(null, false);
      }

      return done(null, user);
    });
  } catch (error) {
    return done(error, false);
  }
};

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: dbConfig.secret,
};

const jwtStrategy = async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
};

export default function() {
  const localLogin = new LocalStrategy(localOptions, localStrategy);
  const jwtLogin = new JwtStrategy(jwtOptions, jwtStrategy);
  passport.use(jwtLogin);
  passport.use(localLogin);
}
