const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const Userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: [40, 'too long'],
    minlength: [10, 'too short'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'too short'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        // this only works on CREATE and SAVE
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
  },
});

Userschema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.isNew) {
    return next();
  }
  this.password = await bcryptjs.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

Userschema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcryptjs.compare(candidatePassword, userPassword);
};

Userschema.methods.changedPasswordAfter =  function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedAt = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < passwordChangedAt;
  }

  return false;
};

const User = new mongoose.model('User', Userschema);

module.exports = User;
