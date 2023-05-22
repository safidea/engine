import { join } from 'path'
import { PlaywrightTestConfig, devices } from '@playwright/test'
import globalSetup from './e2e/setup'

const PORT = process.env.PORT || 3000
const baseURL = `http://localhost:${PORT}`

const config: PlaywrightTestConfig = {
  timeout: 30 * 1000,
  testDir: join(__dirname, 'e2e'),
  retries: 0,
  outputDir: 'coverage/',
  webServer: {
    command: `pnpm dev`,
    url: baseURL,
    timeout: 120 * 1000,
  },
  use: {
    baseURL,
  },
  globalTeardown: join(__dirname, 'e2e', 'teardown.ts'),
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
}

globalSetup()

export default config
