const { validateProfileUpdate } = require('../routes/profileRoutes');

describe('UT-02: Profile Validation Logic', () => {

    test('Age 12 triggers error (below minimum 13)', () => {
        const errs = validateProfileUpdate('Adam', 12, 70, 170, 'male', '');
        expect(errs).toContain('Age must be between 13 and 120');
    });

    test('Age 13 is valid (boundary min)', () => {
        const errs = validateProfileUpdate('Adam', 13, 70, 170, 'male', '');
        expect(errs).toHaveLength(0);
    });

    test('Age 120 is valid (boundary max)', () => {
        const errs = validateProfileUpdate('Adam', 120, 70, 170, 'male', '');
        expect(errs).toHaveLength(0);
    });

    test('Age 121 triggers error (above maximum 120)', () => {
        const errs = validateProfileUpdate('Adam', 121, 70, 170, 'male', '');
        expect(errs).toContain('Age must be between 13 and 120');
    });

    test('Weight 19 triggers error (below minimum 20)', () => {
        const errs = validateProfileUpdate('Adam', 25, 19, 170, 'male', '');
        expect(errs).toContain('Weight must be between 20 kg and 300 kg');
    });

    test('Weight 300 is valid (boundary max)', () => {
        const errs = validateProfileUpdate('Adam', 25, 300, 170, 'male', '');
        expect(errs).toHaveLength(0);
    });

    test('Invalid gender triggers error', () => {
        const errs = validateProfileUpdate('Adam', 25, 70, 170, 'animal', '');
        expect(errs).toContain('Gender must be male, female, or other');
    });

    test('Bio over 500 chars triggers error', () => {
        const errs = validateProfileUpdate('Adam', 25, 70, 170, 'male', 'A'.repeat(501));
        expect(errs.some(e => e.includes('Bio'))).toBe(true);
    });
});