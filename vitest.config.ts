import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    globalSetup: ['./tests/setup/globalSetup.ts'],
    clearMocks: true,
    restoreMocks: true,

    // Run tests sequentially to avoid DB conflicts
    pool: 'threads',
    maxConcurrency: 1, // ensures a single worker
  },
})
