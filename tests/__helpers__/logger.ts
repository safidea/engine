import { LoggerSpi } from '@adapter/spi/LoggerSpi'
import { Logger } from '@domain/services/Logger'
import { LoggerDriver } from '@infrastructure/drivers/LoggerDriver'

export default class extends Logger {
  constructor() {
    super(
      new LoggerSpi(
        new LoggerDriver({
          level: 'error',
          driver: 'Console',
        })
      )
    )
  }
}

const esUrl = process.env.TEST_ELASTICSEARCH_URL
const esUsername = process.env.TEST_ELASTICSEARCH_USERNAME
const esPassword = process.env.TEST_ELASTICSEARCH_PASSWORD
const esIndex = process.env.TEST_ELASTICSEARCH_INDEX

if (!esUrl || !esUsername || !esPassword || !esIndex) {
  throw new Error('Missing ElasticSearch test environment variables')
}

export { esUrl, esUsername, esIndex, esPassword }

export type Hit = { _source: { message: string } }

export async function getElasticSearchHit(message: string): Promise<Hit[]> {
  const url = `${esUrl}/${esIndex}/_search`
  const auth = 'Basic ' + btoa(`${esUsername}:${esPassword}`)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth,
    },
    body: JSON.stringify({
      query: {
        match: {
          message,
        },
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch data from ElasticSearch: ${response.statusText}`)
  }

  const data = await response.json()
  return data.hits.hits
}

export async function checkElasticSearchIndex(index: string): Promise<boolean> {
  const url = `${esUrl}/${index}`
  const auth = 'Basic ' + btoa(`${esUsername}:${esPassword}`)
  const response = await fetch(url, {
    headers: {
      Authorization: auth,
    },
  })

  return response.ok
}

export async function deleteElasticSearchIndex(index: string) {
  const url = `${esUrl}/${index}`
  const auth = 'Basic ' + btoa(`${esUsername}:${esPassword}`)
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: auth,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to delete index from ElasticSearch: ${response.statusText}`)
  }

  return response
}
