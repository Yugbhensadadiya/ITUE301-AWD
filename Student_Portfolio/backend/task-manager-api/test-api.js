/**
 * Automated Test Suite for Practical 5: MongoDB Integration & Schema Design with Mongoose
 * Tests all required CRUD endpoints, Mongoose schema validations, pre-save hooks, and middleware.
 */

async function runTests() {
  const BASE_URL = 'http://localhost:5000';
  let passed = 0;
  let total = 0;

  function assert(condition, testName, details = '') {
    total++;
    if (condition) {
      console.log(` [PASS] ${testName}`);
      passed++;
    } else {
      console.error(` [FAIL] ${testName} - ${details}`);
    }
  }

  console.log('\n--- STARTING PRACTICAL 5 MONGODB / MONGOOSE REST API TESTS ---\n');

  try {
    // 1. GET /tasks (200 OK)
    const getRes = await fetch(`${BASE_URL}/tasks`);
    const getBody = await getRes.json();
    assert(getRes.status === 200 && Array.isArray(getBody), 'GET /tasks returns status 200 and task array');

    // 2. POST /tasks (201 Created) - With valid fields and priority
    const postRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '  Learn Mongoose Schema Design  ',
        description: 'Understand models, schemas, validations, and hooks',
        priority: 'high'
      })
    });
    const postBody = await postRes.json();
    assert(
      postRes.status === 201 &&
      postBody.message === 'Task created successfully' &&
      postBody.task &&
      postBody.task._id,
      'POST /tasks creates task with status 201 and message'
    );

    const createdId = postBody.task?._id;

    // 3. Pre-save Hook Verification: Title whitespace trimmed
    assert(
      postBody.task?.title === 'Learn Mongoose Schema Design',
      'Pre-save hook trimmed whitespace from title before saving'
    );

    // 4. Validation Error: Missing Title (400 Bad Request)
    const missingTitleRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'No title provided' })
    });
    const missingTitleBody = await missingTitleRes.json();
    assert(
      missingTitleRes.status === 400 && missingTitleBody.error === 'Title is required',
      'POST /tasks without title returns 400 with "Title is required"'
    );

    // 5. Validation Error: Invalid Priority Enum (400 Bad Request)
    const invalidPriorityRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Task with invalid priority',
        priority: 'urgent' // Not in ['low', 'medium', 'high']
      })
    });
    const invalidPriorityBody = await invalidPriorityRes.json();
    assert(
      invalidPriorityRes.status === 400 && invalidPriorityBody.error && !invalidPriorityBody.errors,
      'Invalid priority enum returns clean 400 error (no raw Mongoose ValidationError)'
    );

    // 6. GET /tasks/:id (200 OK) - Supplementary Requirement C
    const getByIdRes = await fetch(`${BASE_URL}/tasks/${createdId}`);
    const getByIdBody = await getByIdRes.json();
    assert(
      getByIdRes.status === 200 &&
      getByIdBody.task &&
      getByIdBody.task._id === createdId,
      'GET /tasks/:id retrieves existing task by MongoDB ObjectId'
    );

    // 7. PUT /tasks/:id (200 OK) - Update task
    const putRes = await fetch(`${BASE_URL}/tasks/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Learn Mongoose Schema Design (Updated)',
        completed: true,
        priority: 'medium'
      })
    });
    const putBody = await putRes.json();
    assert(
      putRes.status === 200 &&
      putBody.message === 'Task updated successfully' &&
      putBody.task?.completed === true,
      'PUT /tasks/:id updates task with status 200'
    );

    // 8. DELETE /tasks/:id (200 OK)
    const deleteRes = await fetch(`${BASE_URL}/tasks/${createdId}`, {
      method: 'DELETE'
    });
    const deleteBody = await deleteRes.json();
    assert(
      deleteRes.status === 200 &&
      deleteBody.message === 'Task deleted successfully' &&
      deleteBody.task?._id === createdId,
      'DELETE /tasks/:id deletes task with status 200'
    );

    // 9. GET /tasks/:id on deleted task (404 Not Found)
    const getDeletedRes = await fetch(`${BASE_URL}/tasks/${createdId}`);
    const getDeletedBody = await getDeletedRes.json();
    assert(
      getDeletedRes.status === 404 && getDeletedBody.error === 'Task not found',
      'GET /tasks/:id returns 404 with "Task not found" for non-existent document'
    );

    // 10. Route-Specific Middleware: Invalid ObjectId format (400 Bad Request)
    const invalidIdRes = await fetch(`${BASE_URL}/tasks/invalid-1234-id`);
    const invalidIdBody = await invalidIdRes.json();
    assert(
      invalidIdRes.status === 400 && invalidIdBody.error.includes('Invalid task ID format'),
      'Invalid ObjectId format rejected by middleware with status 400'
    );

    // 11. Content-Type Validation Middleware (400 Bad Request)
    const badContentTypeRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'plain text payload'
    });
    const badContentBody = await badContentTypeRes.json();
    assert(
      badContentTypeRes.status === 400 && badContentBody.error.includes('Invalid Content-Type'),
      'Non-JSON Content-Type rejected with status 400'
    );

    // 12. Custom 404 Handler for Undefined Route (404 Not Found)
    const undefinedRouteRes = await fetch(`${BASE_URL}/api/unknown-endpoint`);
    const undefinedRouteBody = await undefinedRouteRes.json();
    assert(
      undefinedRouteRes.status === 404 && undefinedRouteBody.error === 'Route not found',
      'Undefined route returns status 404 with "Route not found"'
    );

    // 13. Global Error Handler (500 Internal Server Error)
    const errorRes = await fetch(`${BASE_URL}/trigger-error`);
    const errorBody = await errorRes.json();
    assert(
      errorRes.status === 500 && errorBody.error === 'Something went wrong',
      'Global error handler catches unhandled error with status 500'
    );

    console.log(`\n==============================================`);
    console.log(` TEST SUMMARY: ${passed}/${total} Tests Passed (${Math.round((passed / total) * 100)}%)`);
    console.log(`==============================================\n`);

  } catch (err) {
    console.error('Test execution failed:', err);
  }
}

runTests();
