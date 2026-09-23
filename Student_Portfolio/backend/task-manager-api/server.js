/**
 * Practical 5: MongoDB Integration and Schema Design with Mongoose
 * 
 * Objectives:
 * - Upgrade the Task Management API from in-memory array storage to MongoDB.
 * - Configure Mongoose ODM and load environment variables using dotenv.
 * - Define a structured Task model with validation, enum priority, and pre-save hook.
 * - Implement full CRUD operations using Mongoose methods:
 *     - GET    /tasks     -> Task.find()
 *     - GET    /tasks/:id -> Task.findById()
 *     - POST   /tasks     -> Task.create()
 *     - PUT    /tasks/:id -> Task.findByIdAndUpdate()
 *     - DELETE /tasks/:id -> Task.findByIdAndDelete()
 * - Wrap every database operation in try/catch and pass errors via next(err).
 * - Return clean JSON responses (preventing raw Mongoose ValidationError leak).
 * - Retain logging middleware, Content-Type validation, 404 handler, and global error handler.
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import Mongoose Models
const Task = require('./models/Task');
const User = require('./models/User');

// Import Auth Middleware
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager';
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key_practical_7_supersecret';

// ============================================================================
// 1. CORS Configuration (React Frontend Integration - Practical 6)
// ============================================================================
/**
 * Enable Cross-Origin Resource Sharing (CORS) so the React portfolio frontend
 * running on http://localhost:5173, Vite alternate ports, or tools can communicate cleanly.
 */
app.use(cors({
  origin: true, // Allow request origin dynamically for local development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================================================
// 2. Database Connection Configuration
// ============================================================================
/**
 * Connect to MongoDB database using Mongoose ODM.
 * The connection string is retrieved from the .env configuration.
 */
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(` Connected successfully to MongoDB: ${MONGO_URI}`);
  })
  .catch((err) => {
    console.error(' MongoDB connection failed:', err.message);
  });

// ============================================================================
// 3. Global Request Logging Middleware
// ============================================================================
/**
 * Middleware Lifecycle Concept:
 * Intercepts every incoming HTTP request, logs the method, URL, and timestamp,
 * then calls next() to pass control to the subsequent middleware or route handler.
 */
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${req.method} ${req.url} - ${timestamp}`);
  next();
});

// ============================================================================
// 4. Content-Type Validation Middleware (Enhanced for Thunder Client & Postman)
// ============================================================================
/**
 * Ensures that incoming POST and PUT requests declare their body format as JSON.
 * 
 * Audit & Compatibility Enhancements:
 * 1. Bypasses OPTIONS (CORS preflight) and non-modifying methods (GET, DELETE).
 * 2. Case-insensitive header inspection: Handles 'application/json', 'Application/Json',
 *    'application/json; charset=utf-8', etc.
 * 3. Uses req.get('content-type') and req.is('json') for standard Express MIME matching.
 * 4. Prints comprehensive debug logs printing:
 *    - req.method
 *    - req.headers
 *    - req.headers['content-type']
 */
const validateContentType = (req, res, next) => {
  // Always bypass OPTIONS (CORS preflight) and read-only requests
  if (req.method === 'OPTIONS' || req.method === 'GET' || req.method === 'DELETE') {
    return next();
  }

  // Debugging logs required to diagnose Thunder Client requests
  console.log(`\n================== [CONTENT-TYPE AUDIT] ==================`);
  console.log(`[DEBUG] req.method:`, req.method);
  console.log(`[DEBUG] req.url:`, req.originalUrl || req.url);
  console.log(`[DEBUG] req.headers['content-type']:`, req.headers['content-type']);
  console.log(`[DEBUG] req.headers:`, JSON.stringify(req.headers, null, 2));
  console.log(`==========================================================\n`);

  if (req.method === 'POST' || req.method === 'PUT') {
    // Case-insensitive retrieval of Content-Type header
    const rawContentType = req.get('content-type') || req.headers['content-type'] || '';
    const normalizedContentType = rawContentType.toLowerCase().trim();

    // Check if header contains 'application/json' or matches Express JSON MIME detection
    const isJsonHeader = normalizedContentType.includes('application/json');
    const isJsonMime = Boolean(req.is('application/json') || req.is('json'));

    if (!rawContentType || (!isJsonHeader && !isJsonMime)) {
      console.warn(`⚠️ [REJECTED] ${req.method} request rejected due to invalid Content-Type: "${rawContentType || 'MISSING'}"`);
      return res.status(400).json({
        error: 'Invalid Content-Type. Content-Type must be application/json'
      });
    }
  }

  next();
};

// Placed before express.json() to validate incoming headers before parsing body
app.use(validateContentType);

// ============================================================================
// 5. Built-in Body Parser Middleware
// ============================================================================
// express.json() parses incoming HTTP requests with JSON payloads and populates req.body
app.use(express.json());

// ============================================================================
// 6. Route-Specific Middleware: Task ID Validation
// ============================================================================
/**
 * Validates the ':id' route parameter before the database operation executes.
 * In MongoDB / Mongoose, an ID must be a valid 24-character hexadecimal ObjectId.
 */
const validateTaskId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: 'Invalid task ID format. Must be a valid 24-character hexadecimal ObjectId.'
    });
  }
  next();
};

// ============================================================================
// 7. Practical 7: Authentication Route Handlers (JWT + bcryptjs)
// ============================================================================

/**
 * USER REGISTRATION: POST /register
 * - Validates input fields (name, email, password >= 6 chars).
 * - Checks for duplicate email in MongoDB users collection.
 * - Hashes password securely using bcryptjs (salt rounds = 10).
 * - Stores new User document in MongoDB (plain-text password never stored).
 * - Status: 201 Created
 */
app.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    // 1. Validation checks
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // 3. Hash password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create and persist user in MongoDB
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * USER LOGIN: POST /login
 * - Verifies user existence by email.
 * - Compares plain text password against stored bcrypt hash using bcrypt.compare().
 * - Signs a JSON Web Token (JWT) with user ID, name, and email payload.
 * - Status: 200 OK with JWT token & user profile
 */
app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    // 1. Validation checks
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Find user in MongoDB
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Verify password hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 4. Generate signed JWT token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * CURRENT USER PROFILE: GET /me
 * Protected endpoint returning profile of currently logged-in user.
 */
app.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 8. CRUD Route Handlers with Mongoose Operations (Protected by auth)
// ============================================================================

/**
 * READ ALL: GET /tasks
 * Protected by JWT auth middleware
 * Mongoose Method: Task.find()
 * Retrieves all task documents from the MongoDB 'tasks' collection.
 * Status: 200 OK
 */
app.get('/tasks', auth, async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

/**
 * READ ONE BY ID: GET /tasks/:id (Supplementary Requirement C)
 * Protected by JWT auth middleware
 * Mongoose Method: Task.findById()
 * Retrieves a single task document by its MongoDB ObjectId.
 * Status: 200 OK (or 404 Not Found if no document matches)
 */
app.get('/tasks/:id', auth, validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    res.status(200).json({
      message: 'Task retrieved successfully',
      task: task
    });
  } catch (err) {
    next(err);
  }
});

/**
 * CREATE: POST /tasks
 * Protected by JWT auth middleware
 * Mongoose Method: Task.create()
 * Creates a new task document in MongoDB with schema validation.
 * Status: 201 Created
 */
app.post('/tasks', auth, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body || {};

    // Direct check for required title to provide immediate clean error
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        error: 'Title is required'
      });
    }

    // Task.create() triggers schema validators and pre-save hooks
    const newTask = await Task.create({
      title: title.trim(),
      description,
      completed,
      priority
    });

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
  } catch (err) {
    // Pass Mongoose validation errors or DB errors to global error handler
    next(err);
  }
});

/**
 * UPDATE: PUT /tasks/:id
 * Protected by JWT auth middleware
 * Mongoose Method: Task.findByIdAndUpdate()
 * Updates an existing task document in MongoDB by ID.
 * Status: 200 OK (or 404 Not Found if task does not exist)
 */
app.put('/tasks/:id', auth, validateTaskId, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body || {};

    // Validate title if explicitly provided in update request
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return res.status(400).json({
        error: 'Title is required'
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE: DELETE /tasks/:id
 * Protected by JWT auth middleware
 * Mongoose Method: Task.findByIdAndDelete()
 * Permanently removes a task document from the MongoDB collection by its ID.
 * Status: 200 OK (or 404 Not Found if task does not exist)
 */
app.delete('/tasks/:id', auth, validateTaskId, async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    res.status(200).json({
      message: 'Task deleted successfully',
      task: deletedTask
    });
  } catch (err) {
    next(err);
  }
});

// Optional testing endpoint to simulate an unexpected server failure for viva
app.get('/trigger-error', (req, res, next) => {
  next(new Error('Simulated unexpected server error for testing global error handler.'));
});

// ============================================================================
// 8. Custom 404 Route Handler (Preserved from Practical 4)
// ============================================================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

// ============================================================================
// 9. Global Error Handling Middleware (Preserved & Enhanced from Practical 4)
// ============================================================================
/**
 * Express error-handling middleware recognized by 4 arguments: (err, req, res, next).
 * Prevents raw Mongoose ValidationError objects from leaking to the client.
 * Returns clean, human-readable error messages.
 */
app.use((err, req, res, next) => {
  console.error('--- Global Error Handler Stack Trace ---');
  console.error(err.stack);

  // Handle Mongoose Validation Errors (e.g., missing required fields, invalid enum)
  if (err.name === 'ValidationError') {
    const firstErrorMessage = Object.values(err.errors)[0]?.message || 'Validation failed';
    return res.status(400).json({
      error: firstErrorMessage
    });
  }

  // Handle Mongoose CastError (e.g., malformed ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid task ID format'
    });
  }

  // Default to 500 Internal Server Error for unhandled exceptions
  res.status(500).json({
    error: 'Something went wrong'
  });
});

// ============================================================================
// 10. Start Server
// ============================================================================
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Practical 5: Task Management API Server (MongoDB/Mongoose)`);
  console.log(` Server is running on port ${PORT}`);
  console.log(` Base URL: http://localhost:${PORT}`);
  console.log(` Endpoints:`);
  console.log(`   GET    /tasks`);
  console.log(`   GET    /tasks/:id`);
  console.log(`   POST   /tasks`);
  console.log(`   PUT    /tasks/:id`);
  console.log(`   DELETE /tasks/:id`);
  console.log(`=======================================================`);
});

module.exports = app;
