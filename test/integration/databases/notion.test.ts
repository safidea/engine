/*
import { test, expect } from 'bun:test'
import BunApp, { type Config } from '@test/app/bun'

test('should start an app with a notion database', async () => {
  // GIVEN
  const config: Config = {
    name: 'App',
    databases: [
      {
        name: 'Notion',
        type: 'Notion',
        integration: 'Notion',
        parentPageId: 'a0b1c2d3-e4f5-6g7-h8i9-j0k1l2m3n4o5',
      },
    ],
    integrations: [
      {
        name: 'Notion',
        type: 'Notion',
        token: process.env.NOTION_TOKEN,
      },
    ],
  }
  const app = new BunApp()

  // WHEN
  const call = () => app.start(config)

  // THEN
  expect(call()).not.rejects.toThrow()
})
*/
