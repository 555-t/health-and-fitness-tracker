const mongoose = require('mongoose');
const Steps    = require('../models/Steps');
 
describe('UT-04: Steps Schema Defaults & Required Fields', () => {
 
  test('steps defaults to 0 when not provided', () => {
    const s = new Steps({
      userId: new mongoose.Types.ObjectId(),
      date: '2025-06-01'
    });
    expect(s.steps).toBe(0);
  });
 
  test('date is required', () => {
    const s = new Steps({ userId: new mongoose.Types.ObjectId() });
    const err = s.validateSync();
    expect(err.errors['date']).toBeDefined();
  });
 
  test('userId is required', () => {
    const s = new Steps({ date: '2025-06-01' });
    const err = s.validateSync();
    expect(err.errors['userId']).toBeDefined();
  });
 
});
