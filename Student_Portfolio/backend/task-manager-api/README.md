# Task Management REST API (Backend)

**Course:** ITUE301 - Advanced Web Development (AWD)  
**Practical 4:** Building a RESTful API with Node.js and Express  
**Student:** Yug Bhensadadiya  
**University:** CHARUSAT University  
**Degree:** B.Tech Information Technology (5th Semester)  

---

## Practical 4 Overview

A lightweight, beginner-friendly RESTful API built using **Node.js** and **Express.js** to manage tasks using an in-memory data store, custom middleware, and standard HTTP status codes.

### Key Features Implemented:
1. **Express Server:** Runs on port `5000` with `express.json()` body parser.
2. **In-Memory Storage:** Stores tasks in an array (`id`, `title`) with auto-incrementing IDs.
3. **Global Logging Middleware:** Logs `${method} ${url} - ${ISO timestamp}` for every incoming request and calls `next()`.
4. **Full CRUD Endpoints:**
   - `GET /tasks` &rarr; Retrieves all tasks (HTTP 200 OK)
   - `POST /tasks` &rarr; Creates a new task (HTTP 201 Created)
   - `PUT /tasks/:id` &rarr; Updates a task by ID (HTTP 200 OK or 404 Not Found)
   - `DELETE /tasks/:id` &rarr; Removes a task by ID (HTTP 200 OK or 404 Not Found)
5. **Supplementary Task A (Content-Type Validation Middleware):**
   - Inspects `POST` and `PUT` requests.
   - Rejects non-JSON requests with HTTP 400 Bad Request.
6. **Supplementary Task B (Route-Specific ID Validation Middleware):**
   - Validates `:id` param on `PUT` and `DELETE`.
   - Rejects non-numeric or negative IDs with HTTP 400 Bad Request.
7. **Supplementary Task C (Custom 404 Handler):**
   - Catches any undefined route and returns `{ "error": "Route not found" }` (HTTP 404).
8. **Global Error Handler:**
   - 4-argument middleware `(err, req, res, next)` placed as the last middleware.
   - Logs `err.stack` and returns `{ "error": "Something went wrong" }` (HTTP 500).

---

## Folder Structure

```
backend/task-manager-api/
│
├── node_modules/
├── .gitignore
├── package.json
├── package-lock.json
├── server.js        # Main Express application with CRUD & middleware
├── test-api.js      # Automated test suite
└── README.md        # Documentation and Viva reference
```

---

## Installation & Setup

1. Navigate to the task-manager-api directory:
   ```bash
   cd Student_Portfolio/backend/task-manager-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Express API server:
   ```bash
   node server.js
   # or
   npm start
   ```

The server will start on: [http://localhost:5000](http://localhost:5000)

---

## Automated Testing

Run the included test script to verify all endpoints, middleware validations, and error codes:
```bash
node test-api.js
```

### Expected Output:
```
--- STARTING PRACTICAL 4 REST API TESTS ---

✅ [PASS] GET /tasks returns status 200 and task array
✅ [PASS] POST /tasks creates task with status 201
✅ [PASS] PUT /tasks/:id updates task with status 200
✅ [PASS] DELETE /tasks/:id deletes task with status 200
✅ [PASS] Invalid ID parameter rejected with status 400
✅ [PASS] Non-existent task ID returns status 404
✅ [PASS] Non-JSON Content-Type rejected with status 400
✅ [PASS] Undefined route returns status 404 with Route not found
✅ [PASS] Global error handler catches unhandled error with status 500

==============================================
 TEST SUMMARY: 9/9 Tests Passed (100%)
==============================================
```

---

## API Endpoints Reference (Postman / Thunder Client)

### 1. Get All Tasks
- **Method:** `GET`
- **URL:** `http://localhost:5000/tasks`
- **Response:** `200 OK`
  ```json
  [
    { "id": 1, "title": "Learn Express" },
    { "id": 2, "title": "Build REST API" }
  ]
  ```

### 2. Create a Task
- **Method:** `POST`
- **URL:** `http://localhost:5000/tasks`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "title": "Build Frontend Integration"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "id": 3,
    "title": "Build Frontend Integration"
  }
  ```

### 3. Update a Task
- **Method:** `PUT`
- **URL:** `http://localhost:5000/tasks/1`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "title": "Learn Express & Node.js"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "id": 1,
    "title": "Learn Express & Node.js"
  }
  ```

### 4. Delete a Task
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/tasks/2`
- **Response:** `200 OK`
  ```json
  {
    "message": "Task deleted successfully",
    "task": {
      "id": 2,
      "title": "Build REST API"
    }
  }
  ```

---

## Viva Questions & Answers

1. **What is Express middleware and what does `next()` do?**
   - Middleware is a function that has access to the request object (`req`), the response object (`res`), and the `next` middleware function in the application’s request-response cycle. Calling `next()` passes control to the next middleware or route handler in the pipeline. If `next()` is not called, the request hangs.

2. **Why must the Global Error Handler have 4 arguments?**
   - Express identifies error-handling middleware specifically by checking `fn.length === 4` (`err, req, res, next`). If only 3 arguments are provided, Express treats it as regular middleware instead of an error handler.

3. **What is the difference between HTTP Status Codes 200, 201, 400, 404, and 500?**
   - **200 OK:** The request succeeded (e.g. GET, PUT, DELETE).
   - **201 Created:** The request succeeded and a new resource was created (e.g. POST).
   - **400 Bad Request:** Client error such as invalid input format or missing fields.
   - **404 Not Found:** The requested resource or route does not exist.
   - **500 Internal Server Error:** Unexpected server-side failure.
