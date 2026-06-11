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

describe('FT-05: Unknown Routes Return 404', () => {

  // Any unknown /api/ route should return 404
  // Note: non-API routes (e.g. /random-page) return index.html via the SPA catch-all,
  // so we specifically test under /api/ where unmatched routes should 404.
  test('GET /api/unknown-endpoint returns 404', async () => {
    const res = await request(app).get('/api/unknown-endpoint');

    expect(res.status).toBe(404);
  });

});
