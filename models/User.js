const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  facebookId: { type: String },
  githubId: { type: String },
});

// Password hashing before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password is modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Check if the entered password is correct
userSchema.methods.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
