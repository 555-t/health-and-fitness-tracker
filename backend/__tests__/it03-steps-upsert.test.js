const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');
const Steps = require('../models/Steps');
const { useMongoMemory } = require('./helpers/setup');

describe('IT-03: Steps $inc Accumulation', () => {
  useMongoMemory();

  let sessionId, userId;
  const testDate = '2025-05-01';

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Stepper', email: 'stepper@it03.com', password: 'password123' });
    sessionId = res.body.sessionId;
    userId = res.body.user.id;
  });

  test('First POST creates a steps document with correct count', async () => {
    const res = await request(app)
      .post('/api/steps')
      .set('x-session-id', sessionId)
      .send({ date: testDate, steps: 3000 });

    expect(res.status).toBe(200);
    expect(res.body.steps).toBe(3000);
  });

  test('Second POST on same date accumulates via $inc', async () => {
    const res = await request(app)
      .post('/api/steps')
      .set('x-session-id', sessionId)
      .send({ date: testDate, steps: 2000 });

    expect(res.status).toBe(200);
    expect(res.body.steps).toBe(5000);
  });

  test('Database document reflects cumulative total of 5000', async () => {
    const doc = await Steps.findOne({ userId: new mongoose.Types.ObjectId(userId), date: testDate });
    expect(doc).not.toBeNull();
    expect(doc.steps).toBe(5000);
  });
});
