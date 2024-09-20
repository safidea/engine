const authToken = process.env.TEST_SENTRY_AUTH_TOKEN
const organization = process.env.TEST_SENTRY_ORGANIZATION
const project = process.env.TEST_SENTRY_PROJECT
const dsn = process.env.SENTRY_DSN

if (!authToken || !organization || !project || !dsn) {
  throw new Error('Missing Sentry test environment variables')
}

export async function getSentryEvents() {
  const url = `https://sentry.io/api/0/projects/${organization}/${project}/events/`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch events from Sentry: ${response.statusText}`)
  }

  const events = await response.json()
  return events
}
