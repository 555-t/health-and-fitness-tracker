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
    .send({ name: 'Eve', email: 'eve@test.com', password: 'password123' });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'eve@test.com', password: 'password123' });

  sessionId = loginRes.body.sessionId;

  // POST a nutrition log for a known date so GET tests have data to find
  await request(app)
    .post('/api/nutrition')
    .set('x-session-id', sessionId)
    .send({
      date: '2025-05-10',
      goal: { cal: 2000, prot: 150, carb: 200, fat: 65 },
      log: [{ name: 'Apple', mealType: 'Snack', serving: 100, cal: 52, prot: 0, carb: 14, fat: 0 }],
      burned: 0,
    });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('FT-04: Nutrition Routes', () => {

  // POST a nutrition log should return 200 and the saved log
  test('POST /api/nutrition returns 200 and log length 1', async () => {
    const res = await request(app)
      .post('/api/nutrition')
      .set('x-session-id', sessionId)
      .send({
        date: '2025-05-11',
        goal: { cal: 2000, prot: 150, carb: 200, fat: 65 },
        log: [{ name: 'Banana', mealType: 'Breakfast', serving: 120, cal: 89, prot: 1, carb: 23, fat: 0 }],
        burned: 100,
      });

    expect(res.status).toBe(200);
    expect(res.body.log.length).toBe(1);
  });

  // GET a date that has data should return the saved log entry
  test('GET /api/nutrition/2025-05-10 returns the saved Apple entry', async () => {
    const res = await request(app)
      .get('/api/nutrition/2025-05-10')
      .set('x-session-id', sessionId);

    expect(res.status).toBe(200);
    expect(res.body.log[0].name).toBe('Apple');
  });

  // GET a date with no data should return an empty log array
  test('GET /api/nutrition/1999-01-01 returns empty log', async () => {
    const res = await request(app)
      .get('/api/nutrition/1999-01-01')
      .set('x-session-id', sessionId);

    expect(res.status).toBe(200);
    expect(res.body.log).toEqual([]);
  });

});
