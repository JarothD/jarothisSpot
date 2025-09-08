import { z } from 'zod'

// Global config for Zod v4.
// NOTE: 'invalid_string' and 'validation' don't exist here.
// We use 'in' guards to avoid type errors.
z.config({
  customError: (iss) => {
    // Invalid formats (email, uuid, etc.)
    if (iss.code === 'invalid_format') {
      // In some builds 'expected' might exist (e.g.: 'email')
      if ('expected' in iss && iss.expected === 'email') return 'Invalid email'
      return 'Invalid format'
    }

    // Minimum sizes
    if (iss.code === 'too_small') {
      if ('type' in iss && iss.type === 'string' && 'minimum' in iss) {
        return `Minimum ${iss.minimum as number} characters`
      }
      return 'Value too small'
    }

    // Maximum sizes (in case you later define .max())
    if (iss.code === 'too_big') {
      if ('type' in iss && iss.type === 'string' && 'maximum' in iss) {
        return `Maximum ${iss.maximum as number} characters`
      }
      return 'Value too large'
    }

    // Default error message
    return 'Invalid data'
  }
})
