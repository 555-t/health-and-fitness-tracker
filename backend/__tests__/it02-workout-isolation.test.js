const request = require('supertest');
const { app } = require('../server');
const Workout = require('../models/Workout');
const { useMongoMemory } = require('./helpers/setup');

describe('IT-02: Workout Isolation Per User', () => {
  useMongoMemory();

  let sessionA, sessionB, userIdA;

  beforeAll(async () => {
    // Register and login User A
    const regA = await request(app)
      .post('/api/auth/register')
      .send({ name: 'UserA', email: 'usera@it02.com', password: 'password123' });
    sessionA = regA.body.sessionId;
    userIdA = regA.body.user.id;

    // Register and login User B
    const regB = await request(app)
      .post('/api/auth/register')
      .send({ name: 'UserB', email: 'userb@it02.com', password: 'password123' });
    sessionB = regB.body.sessionId;

    // User A posts a workout
    await request(app)
      .post('/api/tracker/workouts')
      .set('x-session-id', sessionA)
      .send({ activity: 'Swimming', duration: 45, date: '2025-05-01', time: '08:00' });

    // User B posts a different workout
    await request(app)
      .post('/api/tracker/workouts')
      .set('x-session-id', sessionB)
      .send({ activity: 'Cycling', duration: 30, date: '2025-05-01', time: '09:00' });
  });

  test("User A's GET only returns their own workout", async () => {
    const res = await request(app)
      .get('/api/tracker/workouts')
      .set('x-session-id', sessionA);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach(w => {
      expect(String(w.userId)).toBe(String(userIdA));
    });
  });

  test("User A's workout is Swimming and stored in DB", async () => {
    const workouts = await Workout.find({ userId: userIdA });
    expect(workouts).toHaveLength(1);
    expect(workouts[0].activity).toBe('Swimming');
  });

  test("User B's workout does not appear in User A's results", async () => {
    const res = await request(app)
      .get('/api/tracker/workouts')
      .set('x-session-id', sessionA);

    const activities = res.body.map(w => w.activity);
    expect(activities).not.toContain('Cycling');
  });
});
