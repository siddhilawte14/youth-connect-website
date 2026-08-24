import assert from 'assert';
import http from 'http';
import app from '../src/app.js';
import { seedDatabase, getStore } from '../src/config/database.js';

let server;
let port;
let baseUrl;

async function startTestServer() {
  process.env.NODE_ENV = 'test';
  await seedDatabase();
  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
}

function stopTestServer() {
  return new Promise((resolve) => {
    server.close(resolve);
  });
}

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

// Helper to make fetch requests easier
async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch (err) {
    // Not json
  }
  return {
    status: response.status,
    headers: response.headers,
    json,
    text,
  };
}

// ─── AUTHENTICATION TESTS ───
test('Auth - Student Login with valid credentials', async () => {
  const res = await request('/api/v1/auth/login/student', {
    method: 'POST',
    body: JSON.stringify({
      emailOrPrn: '21bce045@kkwieer.edu.in',
      password: 'password123',
    }),
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.json.success, true);
  assert.ok(res.json.data.token);
  assert.strictEqual(res.json.data.user.role, 'student');
});

test('Auth - Student Login with PRN works', async () => {
  const res = await request('/api/v1/auth/login/student', {
    method: 'POST',
    body: JSON.stringify({
      emailOrPrn: '21BCE045',
      password: 'password123',
    }),
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.json.success, true);
});

test('Auth - Student Login with invalid password returns 401', async () => {
  const res = await request('/api/v1/auth/login/student', {
    method: 'POST',
    body: JSON.stringify({
      emailOrPrn: '21bce045@kkwieer.edu.in',
      password: 'wrongpassword',
    }),
  });
  assert.strictEqual(res.status, 401);
  assert.strictEqual(res.json.success, false);
  assert.strictEqual(res.json.code, 'AUTH_INVALID_CREDENTIALS');
});

test('Auth - Organizer Login accepts organizer emails', async () => {
  const res = await request('/api/v1/auth/login/organizer', {
    method: 'POST',
    body: JSON.stringify({
      email: 'organizers@techsprint2026.org',
      password: 'password123',
    }),
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.json.success, true);
});

test('Auth - Organizer Login rejects student-format emails', async () => {
  const res = await request('/api/v1/auth/login/organizer', {
    method: 'POST',
    body: JSON.stringify({
      email: '21bce045@kkwieer.edu.in',
      password: 'password123',
    }),
  });
  assert.strictEqual(res.status, 403);
  assert.strictEqual(res.json.success, false);
});

test('Auth - Registration and Profile retrieval', async () => {
  const email = `newstudent_${Date.now()}@test.com`;
  const regRes = await request('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'John Doe',
      email: email,
      password: 'newpassword123',
      role: 'student',
      college: 'KKWIEER',
      prn: `PRN_${Date.now()}`,
    }),
  });
  assert.strictEqual(regRes.status, 201);
  const token = regRes.json.data.token;

  const profRes = await request('/api/v1/auth/profile', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.strictEqual(profRes.status, 200);
  assert.strictEqual(profRes.json.data.email, email);
  assert.strictEqual(profRes.json.data.name, 'John Doe');
});

// ─── EVENT TESTS ───
test('Events - List events', async () => {
  const res = await request('/api/v1/events');
  assert.strictEqual(res.status, 200);
  assert.ok(res.json.data.events.length > 0);
  assert.ok(res.json.data.pagination);
});

test('Events - Create event as organizer works, as student fails', async () => {
  // Login student
  const studRes = await request('/api/v1/auth/login/student', {
    method: 'POST',
    body: JSON.stringify({ emailOrPrn: '21BCE045', password: 'password123' }),
  });
  const studToken = studRes.json.data.token;

  // Login organizer
  const orgRes = await request('/api/v1/auth/login/organizer', {
    method: 'POST',
    body: JSON.stringify({ email: 'organizers@techsprint2026.org', password: 'password123' }),
  });
  const orgToken = orgRes.json.data.token;

  const eventPayload = {
    title: 'Test Hackathon 2026',
    category: 'Technology',
    description: 'This is a test event for automated verification.',
    venue: 'Nashik IT park',
    area: 'College Road',
    fee: 0,
    capacity: 10,
    date: { month: 'NOV', day: '30', fullDate: 'Nov 30, 2026', time: '10:00 AM' },
  };

  // Try as student (should fail with 403)
  const failRes = await request('/api/v1/events', {
    method: 'POST',
    headers: { Authorization: `Bearer ${studToken}` },
    body: JSON.stringify(eventPayload),
  });
  assert.strictEqual(failRes.status, 403);

  // Try as organizer (should succeed with 201)
  const okRes = await request('/api/v1/events', {
    method: 'POST',
    headers: { Authorization: `Bearer ${orgToken}` },
    body: JSON.stringify(eventPayload),
  });
  assert.strictEqual(okRes.status, 201);
  assert.ok(okRes.json.data.id);
});

// ─── PASSES AND REGISTRATION TESTS ───
test('Passes - Register for event increases count, duplicate check', async () => {
  // Login student
  const studRes = await request('/api/v1/auth/login/student', {
    method: 'POST',
    body: JSON.stringify({ emailOrPrn: '21BCE045', password: 'password123' }),
  });
  const studToken = studRes.json.data.token;

  // Fetch initial event detail
  const evBefore = await request('/api/v1/events/evt-photo-walk');
  const countBefore = evBefore.json.data.registeredCount;

  // Register
  const regRes = await request('/api/v1/passes/register', {
    method: 'POST',
    headers: { Authorization: `Bearer ${studToken}` },
    body: JSON.stringify({
      eventId: 'evt-photo-walk',
      fullName: 'Rahul Sharma',
      collegeId: '21BCE045',
      department: 'Computer Science',
      amountPaid: 0,
    }),
  });
  assert.strictEqual(regRes.status, 201);
  assert.ok(regRes.json.data.ticketId);
  assert.ok(regRes.json.data.qrSignature);

  // Verify registration count increased
  const evAfter = await request('/api/v1/events/evt-photo-walk');
  assert.strictEqual(evAfter.json.data.registeredCount, countBefore + 1);

  // Try duplicate registration (should return 409)
  const dupRes = await request('/api/v1/passes/register', {
    method: 'POST',
    headers: { Authorization: `Bearer ${studToken}` },
    body: JSON.stringify({
      eventId: 'evt-photo-walk',
      fullName: 'Rahul Sharma',
      collegeId: '21BCE045',
      department: 'Computer Science',
      amountPaid: 0,
    }),
  });
  assert.strictEqual(dupRes.status, 409);
});

// ─── GATE SCANNER TESTS ───
test('Gate - Verification statuses (valid, already used, wrong event, not found)', async () => {
  // Login organizer for gate scanner access
  const orgRes = await request('/api/v1/auth/login/organizer', {
    method: 'POST',
    body: JSON.stringify({ email: 'organizers@techsprint2026.org', password: 'password123' }),
  });
  const orgToken = orgRes.json.data.token;

  // TKT-8492-XYS is seeded for evt-techsprint-2026
  const pass = getStore().passes['TKT-8492-XYS'];
  const validCode = `TKT-8492-XYS:${pass.qrSignature}`;

  // 1. Verify valid pass for the correct event
  const resValid = await request('/api/v1/gate/verify', {
    method: 'POST',
    headers: { Authorization: `Bearer ${orgToken}` },
    body: JSON.stringify({ ticketCode: validCode, targetEventId: 'evt-techsprint-2026' }),
  });
  assert.strictEqual(resValid.status, 200);
  assert.strictEqual(resValid.json.data.status, 'VALID_TICKET');

  // 2. Verify valid pass for wrong event
  const resWrong = await request('/api/v1/gate/verify', {
    method: 'POST',
    headers: { Authorization: `Bearer ${orgToken}` },
    body: JSON.stringify({ ticketCode: validCode, targetEventId: 'evt-design-thinking' }),
  });
  assert.strictEqual(resWrong.status, 200);
  assert.strictEqual(resWrong.json.data.status, 'WRONG_EVENT');

  // 3. Redeem pass
  const resRedeem = await request('/api/v1/gate/redeem', {
    method: 'POST',
    headers: { Authorization: `Bearer ${orgToken}` },
    body: JSON.stringify({ ticketCode: validCode }),
  });
  assert.strictEqual(resRedeem.status, 200);
  assert.strictEqual(resRedeem.json.data.status, 'ENTRY_CONFIRMED');

  // 4. Verify already used pass
  const resUsed = await request('/api/v1/gate/verify', {
    method: 'POST',
    headers: { Authorization: `Bearer ${orgToken}` },
    body: JSON.stringify({ ticketCode: validCode, targetEventId: 'evt-techsprint-2026' }),
  });
  assert.strictEqual(resUsed.status, 200);
  assert.strictEqual(resUsed.json.data.status, 'ALREADY_USED');

  // 5. Verify non-existent ticket
  const resMissing = await request('/api/v1/gate/verify', {
    method: 'POST',
    headers: { Authorization: `Bearer ${orgToken}` },
    body: JSON.stringify({ ticketCode: 'TKT-9999-NON:abcde', targetEventId: 'evt-techsprint-2026' }),
  });
  assert.strictEqual(resMissing.status, 200);
  assert.strictEqual(resMissing.json.data.status, 'TICKET_NOT_FOUND');
});

// ─── ADMIN TESTS ───
test('Admin - Verification toggle, audit logs, stats', async () => {
  // Login admin
  const adminRes = await request('/api/v1/auth/login/organizer', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@youthconnect.in', password: 'admin123' }),
  });
  const adminToken = adminRes.json.data.token;

  // 1. Get dashboard stats
  const statsRes = await request('/api/v1/admin/stats', {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.strictEqual(statsRes.status, 200);
  assert.ok(statsRes.json.data.totalEvents > 0);

  // 2. Toggle club verification
  const clubResBefore = await request('/api/v1/community/clubs');
  const club = clubResBefore.json.data[0];
  const initialVerify = club.isVerified;

  const toggleRes = await request(`/api/v1/admin/clubs/${club.id}/toggle-verify`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.strictEqual(toggleRes.status, 200);
  assert.strictEqual(toggleRes.json.data.isVerified, !initialVerify);

  // 3. Get audit logs
  const logsRes = await request('/api/v1/admin/audit-logs', {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.strictEqual(logsRes.status, 200);
  assert.ok(logsRes.json.data.logs.length > 0);
  assert.ok(logsRes.json.data.logs[0].hash); // verifies integrity hash exists
});

async function runAll() {
  console.log('🚀 Starting Youth Connect API Test Suite...\n');
  await startTestServer();

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      await t.fn();
      console.log(`✅ Passed: ${t.name}`);
      passed++;
    } catch (err) {
      console.error(`❌ Failed: ${t.name}`);
      console.error(err);
      failed++;
    }
  }

  await stopTestServer();

  console.log(`\n========================================`);
  console.log(`Test Execution Summary:`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAll().catch(err => {
  console.error('Fatal testing error:', err);
  process.exit(1);
});
