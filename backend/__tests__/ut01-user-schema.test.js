const User = require('../models/User');

describe('UT-01: User Schema Validation', () => {

  test('name is required', () => {
    const u = new User({ email: 'sharifah123@gmail.com', password: 'sharifah123' });
    const err = u.validateSync();
    expect(err.errors['name']).toBeDefined();
  });
  
  test('name min length 2 is enforced', () => {
    const u = new User({ name: 's', email: 'sharifah123@gmail.com', password: 'sharifah123' });
    const err = u.validateSync();
    expect(err.errors['name']).toBeDefined();
  });

  test('email is required', () => {
    const u = new User({ name: 'Sharifah', password: 'sharifah123' });
    const err = u.validateSync();
    expect(err.errors['email']).toBeDefined();
  });

  test('email format is validated', () => {
    const u = new User({ name: 'Sharifah', email: 'invalidtest', password: 'sharifah123' });
    const err = u.validateSync();
    expect(err.errors['email']).toBeDefined();
  });

  test('password min length 6 is enforced', () => {
    const u = new User({ name: 'Sharifah', email: 'sharifah123@gmail.com', password: '123' });
    const err = u.validateSync();
    expect(err.errors['password']).toBeDefined();
  });

  test('valid user passes schema validation', () => {
    const u = new User({ name: 'Sharifah', email: 'sharifah123@gmail.com', password: 'sharifah123' });
    const err = u.validateSync();
    expect(err).toBeUndefined();
  });
});