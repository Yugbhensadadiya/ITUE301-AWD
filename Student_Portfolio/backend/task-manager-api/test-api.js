/**
 * Test Suite for Task Management REST API (Practical 4)
 * Tests all required CRUD endpoints, middleware validations, and HTTP status codes.
 */

async function runTests() {
  const BASE_URL = 'http://localhost:5000';
  let passed = 0;
  let total = 0;

  function assert(condition, testName, details = '') {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${details}`);
    }
  }

  console.log('\n--- STARTING PRACTICAL 4 REST API TESTS ---\n');

  try {
    // 1. GET /tasks (200 OK)
    const getRes = await fetch(`${BASE_URL}/tasks`);
    const getBody = await getRes.json();
    assert(getRes.status === 200 && Array.isArray(getBody), 'GET /tasks returns status 200 and task array');

    // 2. POST /tasks (201 Created)
    const postRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Master Node and Express' })
    });
    const postBody = await postRes.json();
    assert(postRes.status === 201 && postBody.id && postBody.title === 'Master Node and Express', 'POST /tasks creates task with status 201');
    const createdId = postBody.id;

    // 3. PUT /tasks/:id (200 OK)
    const putRes = await fetch(`${BASE_URL}/tasks/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Master Node and Express (Updated)' })
    });
    const putBody = await putRes.json();
    assert(putRes.status === 200 && putBody.title === 'Master Node and Express (Updated)', 'PUT /tasks/:id updates task with status 200');

    // 4. DELETE /tasks/:id (200 OK)
    const deleteRes = await fetch(`${BASE_URL}/tasks/${createdId}`, {
      method: 'DELETE'
    });
    const deleteBody = await deleteRes.json();
    assert(deleteRes.status === 200 && deleteBody.message, 'DELETE /tasks/:id deletes task with status 200');

    // 5. Invalid Task ID Validation Middleware (400 Bad Request)
    const invalidIdRes = await fetch(`${BASE_URL}/tasks/not-a-number`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test' })
    });
    const invalidIdBody = await invalidIdRes.json();
    assert(invalidIdRes.status === 400 && invalidIdBody.error, 'Invalid ID parameter rejected with status 400');

    // 6. Task Not Found (404 Not Found)
    const notFoundTaskRes = await fetch(`${BASE_URL}/tasks/99999`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Does not exist' })
    });
    assert(notFoundTaskRes.status === 404, 'Non-existent task ID returns status 404');

    // 7. Content-Type Validation Middleware (400 Bad Request)
    const badContentTypeRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'Some plain text'
    });
    const badContentBody = await badContentTypeRes.json();
    assert(badContentTypeRes.status === 400 && badContentBody.error, 'Non-JSON Content-Type rejected with status 400');

    // 8. Custom 404 Handler for Undefined Routes (404 Not Found)
    const undefinedRouteRes = await fetch(`${BASE_URL}/undefined-api-path`);
    const undefinedRouteBody = await undefinedRouteRes.json();
    assert(undefinedRouteRes.status === 404 && undefinedRouteBody.error === 'Route not found', 'Undefined route returns status 404 with Route not found');

    // 9. Global Error Handler (500 Internal Server Error)
    const errorRes = await fetch(`${BASE_URL}/trigger-error`);
    const errorBody = await errorRes.json();
    assert(errorRes.status === 500 && errorBody.error === 'Something went wrong', 'Global error handler catches unhandled error with status 500');

    console.log(`\n==============================================`);
    console.log(` TEST SUMMARY: ${passed}/${total} Tests Passed (${Math.round((passed/total)*100)}%)`);
    console.log(`==============================================\n`);

  } catch (err) {
    console.error('Test execution failed:', err);
  }
}

runTests();
