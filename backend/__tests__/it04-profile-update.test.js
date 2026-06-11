const request = require('supertest');
const bcrypt = require('bcryptjs');
const { app } = require('../server');
const User = require('../models/User');
const { useMongoMemory } = require('./helpers/setup');

describe('IT-04: Profile Update + Password Re-hash', () => {
  useMongoMemory();

  let userId;
  const originalPassword = 'original123';

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: 'alice@it04.com', password: originalPassword });
    userId = res.body.user.id;
  });

  test('PUT /api/profile/:id updates name and age', async () => {
    const res = await request(app)
      .put(`/api/profile/${userId}`)
      .send({ name: 'Alice Updated', age: 28, weight: 65, height: 165, gender: 'female', bio: '' });

    expect(res.status).toBe(200);
  });

  test('Updated name and age are persisted in the database', async () => {
    const user = await User.findById(userId);
    expect(user.name).toBe('Alice Updated');
    expect(user.age).toBe(28);
  });

  test('PUT /api/profile/:id/change-password returns 200', async () => {
    const res = await request(app)
      .put(`/api/profile/${userId}/change-password`)
      .send({
        currentPassword: originalPassword,
        newPassword: 'newpass123',
        confirmPassword: 'newpass123'
      });

    expect(res.status).toBe(200);
  });

  test('New password is re-hashed and verifiable in DB', async () => {
    const user = await User.findById(userId).select('+password');
    const isMatch = await bcrypt.compare('newpass123', user.password);
    expect(isMatch).toBe(true);
  });

  test('Old password no longer works after change', async () => {
    const user = await User.findById(userId).select('+password');
    const isOldMatch = await bcrypt.compare(originalPassword, user.password);
    expect(isOldMatch).toBe(false);
  });
});
