var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minLength: 5, maxLength: 20 },
    age: { type: Number },
    phone: { type: Number },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', function (next) {
  console.log(this.password);
  if (this.password && this.isModified('password')) {
    console.log(this, "before hashing");
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err);
      this.password = hashed;
    console.log(this, "after hashing");

      return next();
    });
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function (password,cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

var User = mongoose.model('User', userSchema);
module.exports = User;