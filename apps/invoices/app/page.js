import NextAppClient from './client'
import NextAppServer from './server'

export async function generateMetadata() {
  const page = NextAppServer.getConfigFromPath('pages./')
  const { title, metadata = {} } = page
  return { title, ...metadata }
}

export default function Page() {
  const page = NextAppServer.getConfigFromPath('pages./')
  return <NextAppClient page={page} />
}
