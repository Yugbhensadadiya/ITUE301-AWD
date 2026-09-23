const mongoose = require('mongoose');

/**
 * Practical 7: User Model & Schema Definition
 * 
 * Schema Fields:
 * - name: String (required, trimmed)
 * - email: String (required, unique, lowercase, trimmed)
 * - password: String (required, stored as bcrypt hash - NEVER plain text)
 * - createdAt / updatedAt: automatic timestamps
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    }
  },
  {
    timestamps: true
  }
);

// Bind explicitly to 'users' collection in MongoDB
const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
