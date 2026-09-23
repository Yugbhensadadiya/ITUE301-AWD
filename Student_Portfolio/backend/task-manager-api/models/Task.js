/**
 * Practical 5: MongoDB Integration and Schema Design with Mongoose
 * File: models/Task.js
 * 
 * Objectives:
 * - Define a structured Mongoose schema for tasks.
 * - Enforce schema constraints, data types, default values, and validations.
 * - Implement supplementary requirements: priority enum and pre-save trimming hook.
 */

const mongoose = require('mongoose');

// ============================================================================
// 1. Task Schema Definition
// ============================================================================
const taskSchema = new mongoose.Schema({
  // Task title: required String with clean validation error message
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  // Task description: optional String
  description: {
    type: String,
    default: ''
  },
  // Completion status: Boolean with default false
  completed: {
    type: Boolean,
    default: false
  },
  // Supplementary Requirement A: Priority field with enum validation
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: '{VALUE} is not a valid priority. Allowed values: low, medium, high'
    },
    default: 'medium'
  },
  // Timestamp when task is created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ============================================================================
// 2. Supplementary Requirement B: Pre-Save Mongoose Hook
// ============================================================================
/**
 * Mongoose middleware (pre-save hook):
 * Automatically trims leading and trailing whitespace from the title before saving.
 */
taskSchema.pre('save', function () {
  if (this.title) {
    this.title = this.title.trim();
  }
});

// Compile schema into model bound explicitly to 'tasks' collection in MongoDB
const Task = mongoose.model('Task', taskSchema, 'tasks');

module.exports = Task;
