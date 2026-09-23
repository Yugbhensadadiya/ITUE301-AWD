/**
 * Automated Test Suite for Practical 7: Authentication & Middleware Pipeline
 * Tests:
 * - User Registration (POST /register)
 * - Password Hashing & Duplicate Email Rejection
 * - User Login & JWT Issuance (POST /login)
 * - Protected Task CRUD (GET, POST, PUT, DELETE with Bearer token)
 * - 401 Unauthorized Rejection on requests without token
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

  console.log('\n--- STARTING PRACTICAL 7 AUTHENTICATION & CRUD API TESTS ---\n');

  try {
    const testEmail = `student_${Date.now()}@example.com`;
    const testPassword = 'mysecurepassword123';
    let authToken = '';

    // ========================================================================
    // 1. Authentication Pipeline Tests (Practical 7)
    // ========================================================================

    // 1A. Unauthorized Access Rejected (401 Unauthorized)
    const unauthGetRes = await fetch(`${BASE_URL}/tasks`);
    assert(
      unauthGetRes.status === 401,
      'GET /tasks without JWT token returns status 401 Unauthorized'
    );

    // 1B. User Registration (201 Created)
    const registerRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Yug Student',
        email: testEmail,
        password: testPassword
      })
    });
    const registerBody = await registerRes.json();
    assert(
      registerRes.status === 201 && registerBody.user && registerBody.user.email === testEmail,
      'POST /register creates new user with status 201'
    );

    // 1C. Duplicate Registration Rejected (400 Bad Request)
    const duplicateRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate User',
        email: testEmail,
        password: testPassword
      })
    });
    assert(
      duplicateRes.status === 400,
      'POST /register with existing email rejected with status 400'
    );

    // 1D. Invalid Login Rejected (401 Unauthorized)
    const badLoginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'wrong_password'
      })
    });
    assert(
      badLoginRes.status === 401,
      'POST /login with invalid password rejected with status 401'
    );

    // 1E. Valid Login (200 OK + JWT Token)
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    const loginBody = await loginRes.json();
    assert(
      loginRes.status === 200 && loginBody.token,
      'POST /login returns status 200 and signed JWT token'
    );

    authToken = loginBody.token;

    // 1F. Protected Profile (GET /me)
    const meRes = await fetch(`${BASE_URL}/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const meBody = await meRes.json();
    assert(
      meRes.status === 200 && meBody.user && meBody.user.email === testEmail,
      'GET /me with Bearer token retrieves authenticated user profile'
    );

    // ========================================================================
    // 2. Protected Task CRUD Operations (Practical 6 + Practical 7)
    // ========================================================================
    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    };

    // 2A. Authenticated GET /tasks
    const getRes = await fetch(`${BASE_URL}/tasks`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const getBody = await getRes.json();
    assert(
      getRes.status === 200 && Array.isArray(getBody),
      'GET /tasks with Bearer token returns status 200 and task array'
    );

    // 2B. Authenticated POST /tasks
    const postRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: '  Practical 7 Auth Pipeline Task  ',
        description: 'Testing protected task creation',
        priority: 'high'
      })
    });
    const postBody = await postRes.json();
    assert(
      postRes.status === 201 && postBody.task && postBody.task._id,
      'POST /tasks creates task with status 201 and message'
    );

    const createdId = postBody.task?._id;

    // 2C. Pre-save Hook Verification: Title whitespace trimmed
    assert(
      postBody.task?.title === 'Practical 7 Auth Pipeline Task',
      'Pre-save hook trimmed whitespace from title before saving'
    );

    // 2D. Authenticated PUT /tasks/:id
    const putRes = await fetch(`${BASE_URL}/tasks/${createdId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        completed: true,
        priority: 'medium'
      })
    });
    const putBody = await putRes.json();
    assert(
      putRes.status === 200 && putBody.task?.completed === true,
      'PUT /tasks/:id updates task with status 200'
    );

    // 2E. Authenticated DELETE /tasks/:id
    const deleteRes = await fetch(`${BASE_URL}/tasks/${createdId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    assert(
      deleteRes.status === 200,
      'DELETE /tasks/:id removes task with status 200'
    );

    // 2F. Non-existent task returns 404
    const notFoundRes = await fetch(`${BASE_URL}/tasks/${createdId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    assert(
      notFoundRes.status === 404,
      'GET /tasks/:id returns 404 for deleted task'
    );

  } catch (err) {
    console.error('Test execution failed:', err);
  }

  console.log('\n==============================================');
  console.log(` TEST SUMMARY: ${passed}/${total} Tests Passed (${Math.round((passed / total) * 100)}%)`);
  console.log('==============================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
