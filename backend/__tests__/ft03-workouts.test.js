const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { app } = require('../server');

let mongoServer;
let sessionId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Register and login to get a valid sessionId
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'Diana', email: 'diana@test.com', password: 'password123' });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'diana@test.com', password: 'password123' });

  sessionId = loginRes.body.sessionId;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('FT-03: Workout Routes + Session Auth', () => {

  // POST a workout with valid session should return 200 and the saved workout
  test('POST /api/tracker/workouts with valid session returns 200', async () => {
    const res = await request(app)
      .post('/api/tracker/workouts')
      .set('x-session-id', sessionId)
      .send({
        activity: 'Cycling',
        duration: 45,
        date: '2025-05-10',
        time: '08:00',
      });

    expect(res.status).toBe(200);
    expect(res.body.activity).toBe('Cycling');
  });

  // GET workouts with valid session should return an array
  test('GET /api/tracker/workouts with valid session returns array', async () => {
    const res = await request(app)
      .get('/api/tracker/workouts')
      .set('x-session-id', sessionId);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // POST without session header should return 401
  test('POST /api/tracker/workouts without session returns 401', async () => {
    const res = await request(app)
      .post('/api/tracker/workouts')
      .send({
        activity: 'Running',
        duration: 30,
        date: '2025-05-10',
        time: '09:00',
      });
    // No .set('x-session-id', ...) — intentionally missing

    expect(res.status).toBe(401);
  });

});
