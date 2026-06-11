const mongoose = require('mongoose');
const Workout  = require('../models/Workout');
 
describe('UT-03: Workout Schema Validation', () => {
 
  const validBase = {
    userId:   new mongoose.Types.ObjectId(),
    activity: 'Running',
    duration: 30,
    date:     '2025-06-01',
    time:     '08:00'
  };
 
  test('activity is required', () => {
    const { activity, ...rest } = validBase;
    const err = new Workout(rest).validateSync();
    expect(err.errors['activity']).toBeDefined();
  });
 
  test('duration is required', () => {
    const { duration, ...rest } = validBase;
    const err = new Workout(rest).validateSync();
    expect(err.errors['duration']).toBeDefined();
  });
 
  test('date is required', () => {
    const { date, ...rest } = validBase;
    const err = new Workout(rest).validateSync();
    expect(err.errors['date']).toBeDefined();
  });
 
  test('valid workout passes schema', () => {
    const err = new Workout(validBase).validateSync();
    expect(err).toBeUndefined();
  });
 
});
