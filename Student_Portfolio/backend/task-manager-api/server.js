/**
 * Practical 4: Building a RESTful API with Node.js and Express
 * 
 * Objectives:
 * - Build a Task Management REST API using Express.
 * - Perform full CRUD operations on an in-memory data store.
 * - Implement global and route-specific middleware.
 * - Handle HTTP status codes (200, 201, 400, 404, 500).
 * - Global error handling and custom 404 handler.
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// 1. Built-in Middleware
// ============================================================================
// express.json() parses incoming HTTP requests with JSON payloads and populates req.body
app.use(express.json());

// ============================================================================
// 2. In-Memory Data Store
// ============================================================================
// College practical requirement: simple in-memory array storage (no external DB)
let tasks = [
  { id: 1, title: 'Learn Express' },
  { id: 2, title: 'Build REST API' }
];

// ============================================================================
// 3. Global Logging Middleware
// ============================================================================
/**
 * Middleware Lifecycle Concept:
 * Middleware functions have access to the request object (req), response object (res),
 * and the next() function in the application's request-response cycle.
 * Logging middleware logs every incoming request method, URL, and ISO timestamp.
 */
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${req.method} ${req.url} - ${timestamp}`);
  // next() passes control to the next middleware or route handler in the stack
  next();
});

// ============================================================================
// 4. Supplementary Task A: Content-Type Validation Middleware
// ============================================================================
/**
 * Ensures that incoming POST and PUT requests explicitly declare their body
 * format as 'application/json'. If missing or incorrect, reject with HTTP 400.
 */
const validateContentType = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        error: 'Invalid Content-Type. Content-Type must be application/json'
      });
    }
  }
  next();
};

// Apply Content-Type validation middleware globally for modifying requests
app.use(validateContentType);

// ============================================================================
// 5. Supplementary Task B: Route-Specific Middleware (Task ID Validation)
// ============================================================================
/**
 * Validates the ':id' route parameter before the controller executes.
 * Ensures the ID is a valid positive integer.
 */
const validateTaskId = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      error: 'Invalid task ID. ID must be a positive integer.'
    });
  }
  // Attach validated integer ID to request object
  req.taskId = id;
  next();
};

// ============================================================================
// 6. CRUD Route Handlers
// ============================================================================

/**
 * READ ALL: GET /tasks
 * Returns the full list of tasks.
 * Status: 200 OK
 */
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

/**
 * CREATE: POST /tasks
 * Creates a new task from the JSON body.
 * Status: 201 Created
 */
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  // Validation: Check if title exists and is not empty
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: 'Task title is required and must be a non-empty string.'
    });
  }

  // Generate unique auto-incrementing ID
  const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTask = {
    id: newId,
    title: title.trim()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

/**
 * UPDATE: PUT /tasks/:id
 * Updates an existing task by ID using route-specific validateTaskId middleware.
 * Status: 200 OK (or 404 Not Found if task does not exist)
 */
app.put('/tasks/:id', validateTaskId, (req, res) => {
  const { title } = req.body;

  // Validation: Check title
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: 'Task title is required and must be a non-empty string.'
    });
  }

  // Find task by validated ID
  const task = tasks.find(t => t.id === req.taskId);
  if (!task) {
    return res.status(404).json({
      error: `Task with ID ${req.taskId} not found`
    });
  }

  // Update task title
  task.title = title.trim();
  res.status(200).json(task);
});

/**
 * DELETE: DELETE /tasks/:id
 * Removes a task by ID using route-specific validateTaskId middleware.
 * Status: 200 OK (or 404 Not Found if task does not exist)
 */
app.delete('/tasks/:id', validateTaskId, (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: `Task with ID ${req.taskId} not found`
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.status(200).json({
    message: 'Task deleted successfully',
    task: deletedTask
  });
});

// Optional testing endpoint to verify global 500 error handler during viva
app.get('/trigger-error', (req, res, next) => {
  next(new Error('Simulated unexpected server error for testing global error handler.'));
});

// ============================================================================
// 7. Supplementary Task C: Custom 404 Route Handler
// ============================================================================
/**
 * Catches all undefined / unhandled routes.
 * Must be placed after all defined API endpoints and before the error handler.
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

// ============================================================================
// 8. Global Error Handling Middleware
// ============================================================================
/**
 * Express identifies error-handling middleware by its 4 arguments: (err, req, res, next).
 * Must be defined as the LAST middleware in the chain.
 * Status: 500 Internal Server Error
 */
app.use((err, req, res, next) => {
  console.error('--- Global Error Handler Stack Trace ---');
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong'
  });
});

// ============================================================================
// 9. Start Server
// ============================================================================
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Task Management REST API Server is running on port ${PORT}`);
  console.log(` Base URL: http://localhost:${PORT}`);
  console.log(` Endpoints:`);
  console.log(`   GET    /tasks`);
  console.log(`   POST   /tasks`);
  console.log(`   PUT    /tasks/:id`);
  console.log(`   DELETE /tasks/:id`);
  console.log(`=======================================================`);
});

module.exports = app;
