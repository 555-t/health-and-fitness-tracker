const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { app } = require('../server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('FT-01: User Registration', () => {

  // Valid registration should return 201 with token and sessionId
  test('valid registration returns 201 with token and sessionId', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: 'new1@test.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.sessionId).toBeDefined();
  });

  // Registering the same email twice should return 409
  test('duplicate email returns 409', async () => {
    // First registration
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bob', email: 'new2@test.com', password: 'password123' });

    // Second registration with same email
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bob Again', email: 'new2@test.com', password: 'password123' });

    expect(res.status).toBe(409);
  });

  // Missing fields should return 400
  test('incomplete body returns 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'new3@test.com' }); // missing name and password

    expect(res.status).toBe(400);
  });

});
