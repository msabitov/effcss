import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }]
    },
    coverage: {
      provider: 'v8',
      reporter: ['html', 'text', 'json', 'lcov'],
      thresholds: {
        lines: 90,
        branches: 90,
        functions: 90,
        statements: 90
      }
    }
  }
});
