import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const MongooseSchema = mongoose.Schema;

const userSchema = new MongooseSchema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
});

userSchema.pre('save', function(next) {
  const user = this;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, (hashErr, hash) => {
      if (hashErr) return next(hashErr);

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);

    callback(null, isMatch);
  });
};

const ModelClass = mongoose.model('User', userSchema);
export default ModelClass;
