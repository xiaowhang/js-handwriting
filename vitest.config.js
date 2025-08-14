import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 1000,
    environment: 'node',
    include: ['test/**/*.test.js'],
    alias: {
      '@': '/src',
    },
  },
});
