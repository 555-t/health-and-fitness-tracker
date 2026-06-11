const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { app } = require('../server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Register a known user so we have valid credentials to test against
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'Charlie', email: 'charlie@test.com', password: 'password123' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('FT-02: Login', () => {

  // Valid credentials should return 200 with token and sessionId
  test('valid credentials return 200 with token and sessionId', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'charlie@test.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.sessionId).toBeDefined();
  });

  // Wrong password should return 401
  test('wrong password returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'charlie@test.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  // Non-existent email should return 401
  test('non-existent email returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@test.com', password: 'password123' });

    expect(res.status).toBe(401);
  });

  // Empty body should return 400
  test('empty body returns 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(400);
  });

});
