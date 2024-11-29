const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({ //Creates a user schema which allows the user to input a user and password
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre('save', async function (next) { //Password check before savint to database and hashing to secure password
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.isValidPassword = async function (password) { //Ensures password matches one in schema
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);