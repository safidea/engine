import { Client } from '@notionhq/client'

// Initializing a client
export const notion = new Client({
  auth: process.env.TEST_NOTION_TOKEN,
})
