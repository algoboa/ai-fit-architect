import {
  validateEmail,
  validatePassword,
  validateWeight,
  validateHeight,
  validateAge,
  validateReps,
  validateName,
  sanitizeInput,
} from '../../src/utils/validation';

describe('validation utilities', () => {
  describe('validateEmail', () => {
    it('validates correct email formats', () => {
      expect(validateEmail('user@example.com').isValid).toBe(true);
      expect(validateEmail('user.name@domain.org').isValid).toBe(true);
      expect(validateEmail('user+tag@domain.co.uk').isValid).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(validateEmail('invalid').isValid).toBe(false);
      expect(validateEmail('missing@domain').isValid).toBe(false);
      expect(validateEmail('@nodomain.com').isValid).toBe(false);
      expect(validateEmail('spaces in@email.com').isValid).toBe(false);
    });

    it('handles empty and null values', () => {
      expect(validateEmail('').isValid).toBe(false);
      expect(validateEmail(null).isValid).toBe(false);
      expect(validateEmail(undefined).isValid).toBe(false);
    });

    it('trims whitespace', () => {
      const result = validateEmail('  user@example.com  ');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe('user@example.com');
    });
  });

  describe('validatePassword', () => {
    it('validates strong passwords', () => {
      expect(validatePassword('Password1').isValid).toBe(true);
      expect(validatePassword('MySecure123').isValid).toBe(true);
    });

    it('rejects weak passwords', () => {
      expect(validatePassword('short').isValid).toBe(false);
      expect(validatePassword('nouppercase1').isValid).toBe(false);
      expect(validatePassword('NOLOWERCASE1').isValid).toBe(false);
      expect(validatePassword('NoNumbers').isValid).toBe(false);
    });

    it('respects custom options', () => {
      expect(validatePassword('simple', { minLength: 6 }).isValid).toBe(false);
      expect(validatePassword('simple', {
        minLength: 6,
        requireUppercase: false,
        requireNumber: false,
      }).isValid).toBe(true);
    });
  });

  describe('validateWeight', () => {
    it('validates reasonable weights', () => {
      expect(validateWeight(70).isValid).toBe(true);
      expect(validateWeight('72.5').isValid).toBe(true);
      expect(validateWeight(20).isValid).toBe(true);
      expect(validateWeight(500).isValid).toBe(true);
    });

    it('rejects unreasonable weights', () => {
      expect(validateWeight(10).isValid).toBe(false);
      expect(validateWeight(600).isValid).toBe(false);
      expect(validateWeight(-50).isValid).toBe(false);
    });
  });

  describe('validateHeight', () => {
    it('validates reasonable heights', () => {
      expect(validateHeight(170).isValid).toBe(true);
      expect(validateHeight(50).isValid).toBe(true);
      expect(validateHeight(300).isValid).toBe(true);
    });

    it('rejects unreasonable heights', () => {
      expect(validateHeight(30).isValid).toBe(false);
      expect(validateHeight(400).isValid).toBe(false);
    });
  });

  describe('validateAge', () => {
    it('validates valid ages', () => {
      expect(validateAge(25).isValid).toBe(true);
      expect(validateAge(13).isValid).toBe(true);
      expect(validateAge(120).isValid).toBe(true);
    });

    it('rejects invalid ages', () => {
      expect(validateAge(10).isValid).toBe(false);
      expect(validateAge(150).isValid).toBe(false);
      expect(validateAge(-5).isValid).toBe(false);
    });
  });

  describe('validateReps', () => {
    it('validates valid rep counts', () => {
      expect(validateReps(10).isValid).toBe(true);
      expect(validateReps(1).isValid).toBe(true);
      expect(validateReps(100).isValid).toBe(true);
    });

    it('rejects invalid rep counts', () => {
      expect(validateReps(0).isValid).toBe(false);
      expect(validateReps(101).isValid).toBe(false);
      expect(validateReps(-5).isValid).toBe(false);
    });
  });

  describe('validateName', () => {
    it('validates valid names', () => {
      expect(validateName('John').isValid).toBe(true);
      expect(validateName('Mary Jane').isValid).toBe(true);
      expect(validateName('José García').isValid).toBe(true);
    });

    it('rejects invalid names', () => {
      expect(validateName('J').isValid).toBe(false);
      expect(validateName('').isValid).toBe(false);
      expect(validateName('<script>').isValid).toBe(false);
    });

    it('trims whitespace', () => {
      const result = validateName('  John  ');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe('John');
    });
  });

  describe('sanitizeInput', () => {
    it('removes dangerous characters', () => {
      expect(sanitizeInput('<script>alert(1)</script>')).not.toContain('<');
      expect(sanitizeInput('<script>alert(1)</script>')).not.toContain('>');
    });

    it('removes javascript protocol', () => {
      expect(sanitizeInput('javascript:alert(1)')).not.toContain('javascript:');
    });

    it('removes event handlers', () => {
      expect(sanitizeInput('onclick=alert(1)')).toBe('alert(1)');
    });

    it('handles null and undefined', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });

    it('trims whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('limits length', () => {
      const longString = 'a'.repeat(2000);
      expect(sanitizeInput(longString).length).toBe(1000);
    });
  });
});
