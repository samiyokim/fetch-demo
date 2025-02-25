import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Extend vitest's expect method with methods from @testing-library/jest-dom
expect.extend({});

// Cleanup after each test case
afterEach(() => {
  cleanup();
});