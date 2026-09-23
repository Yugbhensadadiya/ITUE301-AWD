/**
 * Practical 6: Centralized API Service for React Frontend
 * 
 * Objective:
 * Centralize all HTTP communication with the Express + MongoDB backend.
 * Provides reusable functions for CRUD operations:
 *   - getTasks():    GET /tasks
 *   - getTaskById(): GET /tasks/:id
 *   - createTask():  POST /tasks
 *   - updateTask():  PUT /tasks/:id
 *   - deleteTask():  DELETE /tasks/:id
 * 
 * Base URL: http://localhost:5000
 */

// Central base URL for the Express backend server
export const BASE_URL = 'http://localhost:5000';

/**
 * Helper to handle HTTP responses uniformly.
 * Throws a descriptive error if response is not ok (4xx or 5xx status).
 */
async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      (data && data.error) ||
      (data && data.message) ||
      `HTTP Error ${response.status}: ${response.statusText || 'Request failed'}`;
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Helper to format network errors (e.g. backend server not running)
 */
function handleNetworkError(error) {
  if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
    throw new Error(
      `Unable to connect to backend at ${BASE_URL}. Please ensure the Node.js Express server is running (node server.js).`
    );
  }
  throw error;
}

/**
 * 1. READ ALL TASKS: GET /tasks
 * Retrieves the full list of task documents stored in MongoDB.
 * @returns {Promise<Array>} Array of task objects
 */
export async function getTasks() {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return handleNetworkError(error);
  }
}

/**
 * 2. READ SINGLE TASK: GET /tasks/:id
 * Retrieves a single task document by its MongoDB ObjectId.
 * @param {string} id - MongoDB 24-character hexadecimal ObjectId
 * @returns {Promise<Object>} Task object
 */
export async function getTaskById(id) {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return handleNetworkError(error);
  }
}

/**
 * 3. CREATE TASK: POST /tasks
 * Sends a new task payload to be saved in MongoDB.
 * @param {Object} taskData - { title, description, priority, completed }
 * @returns {Promise<Object>} Created task object from backend response
 */
export async function createTask(taskData) {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    return await handleResponse(response);
  } catch (error) {
    return handleNetworkError(error);
  }
}

/**
 * 4. UPDATE TASK: PUT /tasks/:id
 * Updates an existing task document in MongoDB.
 * @param {string} id - MongoDB 24-character hexadecimal ObjectId
 * @param {Object} updateData - Partial or full fields to update
 * @returns {Promise<Object>} Updated task object from backend response
 */
export async function updateTask(id, updateData) {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    return await handleResponse(response);
  } catch (error) {
    return handleNetworkError(error);
  }
}

/**
 * 5. DELETE TASK: DELETE /tasks/:id
 * Permanently removes a task document from MongoDB by its ID.
 * @param {string} id - MongoDB 24-character hexadecimal ObjectId
 * @returns {Promise<Object>} Backend response confirming deletion
 */
export async function deleteTask(id) {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return handleNetworkError(error);
  }
}
