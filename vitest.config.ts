import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        projects: [
            {
                // DOM/browser tests require a real browser.
                extends: true,
                test: {
                    name: 'browser',
                    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
                    exclude: ['tests/ssr/**'],
                    browser: {
                        enabled: true,
                        provider: playwright(),
                        instances: [{ browser: 'chromium' }]
                    }
                }
            },
            {
                // Server-side rendering tests run in a plain Node environment
                extends: true,
                test: {
                    name: 'node',
                    environment: 'node',
                    include: ['tests/ssr/**/*.{test,spec}.{ts,tsx}']
                }
            },
            {
                extends: true,
                test: {
                    name: 'bench',
                    include: ['bench/**/*.{test,spec}.{ts,tsx}'],
                    browser: {
                        enabled: true,
                        provider: playwright(),
                        instances: [{ browser: 'chromium' }]
                    },
                    benchmark: {
                        include: ['bench/**/*.{test,spec}.{ts,tsx}']
                    }
                }
            }
        ],
        coverage: {
            provider: 'v8',
            include: ['src/**'],
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
