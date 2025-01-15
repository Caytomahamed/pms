const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../database/dbConfig');

// find all
exports.find = async () => db.select().from('users');

// Find user
exports.findById = async (id) => db.select().from('users').where('id', id);
exports.findAllBy = async (id) => db.select().from('users').where('roleId', id);

// Find user notifications
exports.findByUserNotify = async (id) =>
  db.select().from('notifications').where('userId', id);

// find bay user name
exports.findUserByUsername = async (username) => {
  return await db('users').select().where('username', username).first();
};

// find by role
exports.findByRole = async (id) => {
  return db('users').where('roleId', id);
};
// Create a new user and return the user
exports.create = async (data) => {
  const [id] = await db('users').insert(data);
  return this.findById(id);
};
// Update user by ID and return the updated user
exports.findByIdandUpdate = async (id, changes) => {
  const updated = new Date();
  changes.updated_at = updated;

  if (changes.password) {
    changes.password = await bcrypt.hash(changes.password, 12);
  }

  await db('users').where('id', id).update(changes);
  return this.findById(id);
};

// save the expired time of the code in database
exports.saveCodeExpiredTime = async (userId, codeAndExpiredTime) => {
  return db('password_resets').insert({
    code: codeAndExpiredTime.code,
    codeExpiredTime: codeAndExpiredTime.codeExpiredTime,
    userId,
  });
};

// delete the code and expired time in database
exports.deleteCodeAndExpiredTime = async (userId) => {
  return db('password_resets').where('userId', userId).del();
};
// save the reset token in database
exports.findByUserIdandUpdatePasswordReset = async (id, changes) => {
  return await db('password_resets').where('userId', id).update(changes);
};

// Delete user by ID
exports.findByIdandDelete = async (id) => db('users').where('id', id).del();

// Check if the provided password matches the user's hashed password
exports.correctPassword = async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword);
};

// Check if the user's password was changed after a specific timestamp
exports.changePasswordAfter = (updateTime, JWTTimestamp) => {
  if (updateTime) {
    const changedTimestamp = new Date(updateTime).getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Create a password reset token for the user
exports.createPasswordResetToken = async (user) => {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const changes = {
    passwordResetToken: hashedToken,
    passwordResetExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
  };

  await this.findByIdandUpdate(user.id, changes);

  return resetToken;
};
