const request = require('supertest');
const { app } = require('../server');
const User = require('../models/User');
const { useMongoMemory } = require('./helpers/setup');

describe('IT-01: Register → Password Hashed in DB', () => {
  useMongoMemory();

  const testEmail = 'alice@it01.com';
  const plainPassword = 'plaintext123';

  beforeAll(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: testEmail, password: plainPassword });
  });

  test('User document is created in the database', async () => {
    const user = await User.findOne({ email: testEmail });
    expect(user).not.toBeNull();
    expect(user.email).toBe(testEmail);
  });

  test('Stored password is not plain text', async () => {
    const user = await User.findOne({ email: testEmail }).select('+password');
    expect(user.password).not.toBe(plainPassword);
  });

  test('Stored password is a bcrypt hash', async () => {
    const user = await User.findOne({ email: testEmail }).select('+password');
    expect(user.password).toMatch(/^\$2[ab]\$/);
  });
});
