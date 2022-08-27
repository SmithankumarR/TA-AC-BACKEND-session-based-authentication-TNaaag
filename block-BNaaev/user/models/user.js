var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 5, maxLength: 15 },
    age: { type: Number, default: 0 },
    phone: { type: Number },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  console.log(this, 'inside the pre hook');
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err);
      this.password = hashed;
      return next();
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
