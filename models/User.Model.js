const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// User schema definition
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: [40, 'Name too long'],
    minlength: [10, 'Name too short'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  photo: String,
  password: {
    type: String,
    minlength: [8, 'Password too short'],
    select: false, // Do not return password in queries
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      // Only runs on create/save
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'admin', 'lead-guide'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active:{
    type:Boolean,
    select:false,
    default:true
    
  }
});

userSchema.pre(/^find/, async function (next) {
  
  this.find({active:{ $ne:false}}) ;
  next();
});


// Hash password before saving (if modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // ✅ Only skip if NOT modified

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // Do not store confirm field in DB
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Compare login password with hashed DB password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  storedHashedPassword,
) {
  return await bcrypt.compare(candidatePassword, storedHashedPassword);
};

// Check if password was changed after the token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // Generate random token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash the token and set it to the passwordResetToken field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log(resetToken, this.passwordResetToken);

  // Set expiration time for the reset token
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken; // Return the plain token for sending to user
};

const User = mongoose.model('User', userSchema);
module.exports = User;
