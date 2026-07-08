const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { toUser } = require('../utils/mappers');
const { NotFoundError, ValidationError, AuthenticationError } = require('../utils/errors');
const { deleteFile, parsePublicUrl } = require('../utils/storage');

async function listUsers() {
  // NOTE: previously this SELECT omitted `username` and `profile_picture`,
  // so every row came back with username: '' and profilePicture: null
  // regardless of the real values — silently breaking any feature (like a
  // map of farmer avatars) that relies on the bulk list having them. See
  // BUGS_FOUND.md.
  const result = await pool.query(
    'SELECT id, username, name, email, phone, role, location, province, profile_picture, joined_date, avatar_color FROM profiles ORDER BY joined_date DESC, name ASC'
  );
  return result.rows.map(toUser);
}

async function getUserById(id) {
  const result = await pool.query('SELECT * FROM profiles WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    throw new NotFoundError('User not found');
  }
  return toUser(result.rows[0]);
}

async function updateUserProfile(userId, profileData) {
  const { name, phone, location, province } = profileData;
  const updates = [];
  const values = [];
  let idx = 1;

  if (name !== undefined) { updates.push(`name = $${idx++}`); values.push(name); }
  if (phone !== undefined) { updates.push(`phone = $${idx++}`); values.push(phone); }
  if (location !== undefined) { updates.push(`location = $${idx++}`); values.push(location); }
  if (province !== undefined) { updates.push(`province = $${idx++}`); values.push(province); }

  if (updates.length === 0) {
    throw new ValidationError('No fields to update');
  }

  values.push(userId);
  const result = await pool.query(
    `UPDATE profiles SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('User not found');
  }
  return toUser(result.rows[0]);
}

async function changePassword(userId, currentPassword, newPassword, confirmPassword) {
  if (newPassword !== confirmPassword) {
    throw new ValidationError('Passwords do not match');
  }
  if (newPassword.length < 6) {
    throw new ValidationError('New password must be at least 6 characters');
  }

  const result = await pool.query('SELECT password_hash FROM profiles WHERE id = $1', [userId]);
  if (result.rows.length === 0) {
    throw new NotFoundError('User not found');
  }

  const match = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
  if (!match) {
    throw new AuthenticationError('Current password is incorrect');
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE profiles SET password_hash = $1 WHERE id = $2', [newHash, userId]);
  return { success: true };
}

async function updateUserLocation(userId, location, province) {
  const result = await pool.query(
    'UPDATE profiles SET location = $1, province = $2 WHERE id = $3 RETURNING *',
    [location, province, userId]
  );
  if (result.rows.length === 0) {
    throw new NotFoundError('User not found');
  }
  return toUser(result.rows[0]);
}

async function updateProfilePicture(userId, newImageUrl) {
  const user = await pool.query('SELECT profile_picture FROM profiles WHERE id = $1', [userId]);
  if (user.rows.length === 0) {
    throw new NotFoundError('User not found');
  }

  const oldImageUrl = user.rows[0].profile_picture;

  const result = await pool.query(
    'UPDATE profiles SET profile_picture = $1 WHERE id = $2 RETURNING *',
    [newImageUrl, userId]
  );

  if (oldImageUrl && oldImageUrl !== newImageUrl) {
    const parsed = parsePublicUrl(oldImageUrl);
    if (parsed) {
      await deleteFile(parsed.bucket, parsed.path);
    }
  }

  return toUser(result.rows[0]);
}

module.exports = {
  listUsers,
  getUserById,
  updateUserProfile,
  changePassword,
  updateUserLocation,
  updateProfilePicture,
};
