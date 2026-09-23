# Practical 5: MongoDB Integration and Schema Design with Mongoose

**Course:** ITUE301 - Advanced Web Development (AWD)  
**Practical 5:** MongoDB Integration and Schema Design with Mongoose  
**Student:** Yug Bhensadadiya  
**University:** CHARUSAT University  
**Degree:** B.Tech Information Technology (5th Semester)  

---

## 1. Practical 5 Overview

This project upgrades the **Practical 4 Task Management REST API** from volatile in-memory storage to a persistent **MongoDB** database utilizing **Mongoose ODM**. It enforces a strictly typed Schema, validation constraints, enum fields, pre-save middleware hooks, and clean error formatting for college lab evaluations and viva examinations.

### Key Upgrades from Practical 4:
1. **Persistent Database:** Integrated MongoDB running locally at `mongodb://localhost:27017/taskmanager` (collection: `tasks`).
2. **Environment Variable Configuration:** Added `dotenv` to load `MONGO_URI` and `PORT` securely from `.env`.
3. **Mongoose Schema & Model (`models/Task.js`):**
   - `title`: String, required with custom error (`"Title is required"`), trimmed.
   - `description`: String, default empty string.
   - `completed`: Boolean, default `false`.
   - `priority`: String enum (`['low', 'medium', 'high']`), default `'medium'`.
   - `createdAt`: Date, default `Date.now`.
4. **Mongoose Operations:**
   - `GET /tasks` &rarr; `Task.find()`
   - `GET /tasks/:id` &rarr; `Task.findById()` (Supplementary Requirement C)
   - `POST /tasks` &rarr; `Task.create()`
   - `PUT /tasks/:id` &rarr; `Task.findByIdAndUpdate()`
   - `DELETE /tasks/:id` &rarr; `Task.findByIdAndDelete()`
5. **Robust Error & Exception Handling:**
   - Every database operation is wrapped in a `try / catch` block.
   - Database and schema errors are passed to Express's global error handler using `next(err)`.
   - Raw Mongoose `ValidationError` objects are intercepted and returned as clean JSON: `{ "error": "Title is required" }`.
6. **Supplementary Requirements:**
   - **A. Priority Field:** Enforced enum (`'low'`, `'medium'`, `'high'`).
   - **B. Pre-Save Hook:** Automatically trims title whitespace prior to persistence.
   - **C. GET by ID (`/tasks/:id`):** Returns 404 `{ "error": "Task not found" }` if the document is absent.
7. **Preserved Practical 4 Architecture:**
   - Global request logging middleware (`METHOD URL - TIMESTAMP`).
   - Content-Type verification (`application/json`).
   - Route-specific ID validation middleware (`ObjectId` validation).
   - Custom 404 handler for undefined routes.
   - Centralized 4-argument global error handler.

---

## 2. Complete Folder Structure

```
backend/task-manager-api/
│
├── models/
│   └── Task.js              # Mongoose Schema, validation, enum, and pre-save hook
│
├── node_modules/            # Installed project dependencies
├── .env                     # Local environment variables (PORT, MONGO_URI)
├── .env.example             # Environment template for replication
├── .gitignore               # Git ignored files (node_modules, .env)
├── package.json             # Project metadata and dependencies (express, mongoose, dotenv)
├── package-lock.json        # Exact dependency lockfile
├── server.js                # Express app, DB connection, middleware, CRUD routes
├── test-api.js              # Automated test suite (13 test cases, 100% pass)
└── README.md                # Comprehensive documentation and Viva prep
```

---

## 3. Environment Variables Configuration

### `.env`
```env
MONGO_URI=mongodb://localhost:27017/taskmanager
PORT=5000
```

### `.env.example`
```env
MONGO_URI=mongodb://localhost:27017/taskmanager
PORT=5000
```

---

## 4. Installation & Running the Project

### Prerequisites:
- **Node.js** (v18+ recommended)
- **MongoDB** running locally on port `27017`
- **MongoDB Compass** (optional, to visually inspect the `taskmanager` database)

### Steps:

1. **Navigate to the API Directory:**
   ```bash
   cd Student_Portfolio/backend/task-manager-api
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   *(Installs `express`, `mongoose`, and `dotenv`)*

3. **Start the API Server:**
   ```bash
   npm start
   # or
   node server.js
   ```

4. **Verify Console Output:**
   ```text
   =======================================================
    Practical 5: Task Management API Server (MongoDB/Mongoose)
    Server is running on port 5000
    Base URL: http://localhost:5000
    Endpoints:
      GET    /tasks
      GET    /tasks/:id
      POST   /tasks
      PUT    /tasks/:id
      DELETE /tasks/:id
   =======================================================
    Connected successfully to MongoDB: mongodb://localhost:27017/taskmanager
   ```

5. **Run Automated Test Suite:**
   In a separate terminal:
   ```bash
   npm test
   # or
   node test-api.js
   ```

---

## 5. Postman Testing Guide & Expected Outputs

Base URL: `http://localhost:5000`

### 1. Create a Task (POST `/tasks`)
- **Method:** `POST`
- **URL:** `http://localhost:5000/tasks`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "title": "  Complete Practical 5 Submission  ",
    "description": "Integrate Mongoose and test all CRUD endpoints",
    "priority": "high"
  }
  ```
- **HTTP Status:** `201 Created`
- **Response Body:**
  ```json
  {
    "message": "Task created successfully",
    "task": {
      "_id": "6724a18f4a7c00e123456789",
      "title": "Complete Practical 5 Submission",
      "description": "Integrate Mongoose and test all CRUD endpoints",
      "completed": false,
      "priority": "high",
      "createdAt": "2026-09-17T07:35:00.000Z",
      "__v": 0
    }
  }
  ```
  *(Notice: The pre-save hook automatically trimmed whitespace from `"title"`)*

---

### 2. Get All Tasks (GET `/tasks`)
- **Method:** `GET`
- **URL:** `http://localhost:5000/tasks`
- **HTTP Status:** `200 OK`
- **Response Body:**
  ```json
  [
    {
      "_id": "6724a18f4a7c00e123456789",
      "title": "Complete Practical 5 Submission",
      "description": "Integrate Mongoose and test all CRUD endpoints",
      "completed": false,
      "priority": "high",
      "createdAt": "2026-09-17T07:35:00.000Z",
      "__v": 0
    }
  ]
  ```

---

### 3. Get Task by ID (GET `/tasks/:id`)
- **Method:** `GET`
- **URL:** `http://localhost:5000/tasks/6724a18f4a7c00e123456789`
- **HTTP Status:** `200 OK`
- **Response Body:**
  ```json
  {
    "message": "Task retrieved successfully",
    "task": {
      "_id": "6724a18f4a7c00e123456789",
      "title": "Complete Practical 5 Submission",
      "description": "Integrate Mongoose and test all CRUD endpoints",
      "completed": false,
      "priority": "high",
      "createdAt": "2026-09-17T07:35:00.000Z",
      "__v": 0
    }
  }
  ```

- **When Task ID Does Not Exist (e.g., `6724a18f4a7c00e123459999`):**
  - **HTTP Status:** `404 Not Found`
  - **Response Body:**
    ```json
    {
      "error": "Task not found"
    }
    ```

---

### 4. Update a Task (PUT `/tasks/:id`)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/tasks/6724a18f4a7c00e123456789`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "completed": true,
    "priority": "medium"
  }
  ```
- **HTTP Status:** `200 OK`
- **Response Body:**
  ```json
  {
    "message": "Task updated successfully",
    "task": {
      "_id": "6724a18f4a7c00e123456789",
      "title": "Complete Practical 5 Submission",
      "description": "Integrate Mongoose and test all CRUD endpoints",
      "completed": true,
      "priority": "medium",
      "createdAt": "2026-09-17T07:35:00.000Z",
      "__v": 0
    }
  }
  ```

---

### 5. Delete a Task (DELETE `/tasks/:id`)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/tasks/6724a18f4a7c00e123456789`
- **HTTP Status:** `200 OK`
- **Response Body:**
  ```json
  {
    "message": "Task deleted successfully",
    "task": {
      "_id": "6724a18f4a7c00e123456789",
      "title": "Complete Practical 5 Submission",
      "description": "Integrate Mongoose and test all CRUD endpoints",
      "completed": true,
      "priority": "medium",
      "createdAt": "2026-09-17T07:35:00.000Z",
      "__v": 0
    }
  }
  ```

---

### 6. Validation Error Handling Demonstration

#### A. Missing Title Validation:
- **Request:** `POST /tasks` with body `{ "description": "No title provided" }`
- **HTTP Status:** `400 Bad Request`
- **Response Body:**
  ```json
  {
    "error": "Title is required"
  }
  ```

#### B. Invalid Enum for Priority:
- **Request:** `POST /tasks` with body `{ "title": "Test", "priority": "critical" }`
- **HTTP Status:** `400 Bad Request`
- **Response Body:**
  ```json
  {
    "error": "critical is not a valid priority. Allowed values: low, medium, high"
  }
  ```

#### C. Malformed ObjectId:
- **Request:** `GET /tasks/123-invalid-id`
- **HTTP Status:** `400 Bad Request`
- **Response Body:**
  ```json
  {
    "error": "Invalid task ID format. Must be a valid 24-character hexadecimal ObjectId."
  }
  ```

---

## 6. Viva Questions & Answers Reference

1. **What is Mongoose and why do we use it over the Native MongoDB Driver?**
   - Mongoose is an **Object Data Modeling (ODM)** library for MongoDB and Node.js. It provides a schema-based solution to model application data, enforcing strict types, field validations, default values, query building, and lifecycle hooks (pre/post middleware) directly in application code.

2. **What is the purpose of a Mongoose Schema vs. a Model?**
   - A **Schema** defines the structure of the document (fields, data types, validators, default values).
   - A **Model** is a compiled wrapper on top of the Schema that provides the direct programming interface for querying and modifying MongoDB collections (e.g. `Task.find()`, `Task.create()`).

3. **How does Mongoose map model names to MongoDB collections?**
   - By default, Mongoose lowercases and pluralizes the model name (e.g., `'Task'` becomes `'tasks'`). An explicit collection name can be passed as the third parameter: `mongoose.model('Task', taskSchema, 'tasks')`.

4. **What is a Mongoose Pre-Save hook and where is it executed?**
   - A pre-save hook (`schema.pre('save', ...)`) is document middleware executed on the Node.js server *before* saving a document to the database. In Practical 5, it is used to trim whitespace from the task title before saving.

5. **Why must `runValidators: true` be specified in `findByIdAndUpdate`?**
   - By default, Mongoose only runs schema validators on `save()` and `create()`. When running update operations like `findByIdAndUpdate()`, validators are bypassed unless `{ runValidators: true }` is explicitly provided.

6. **How do we handle Mongoose errors cleanly without exposing raw database errors?**
   - When Mongoose throws a `ValidationError` or `CastError`, the route's `catch(err)` passes it to the 4-argument global error handler via `next(err)`. The global handler inspects `err.name`, extracts `Object.values(err.errors)[0].message`, and returns a user-friendly JSON message: `{ "error": "Title is required" }` with HTTP 400.
