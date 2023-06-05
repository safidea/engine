import { join } from 'path'
import { PlaywrightTestConfig, devices } from '@playwright/test'

const config: PlaywrightTestConfig = {
  timeout: 3 * 60 * 1000,
  testDir: join(__dirname, 'e2e'),
  retries: 0,
  workers: 4,
  outputDir: join(__dirname, 'coverage/'),
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
}

export default config
