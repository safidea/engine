import NextAppClient from '../client'
import NextAppServer from '../server'

export async function generateMetadata() {
  const page = NextAppServer.getConfigFromPath('pages./create')
  const { title, metadata = {} } = page
  return { title, ...metadata }
}

export default function Page() {
  const page = NextAppServer.getConfigFromPath('pages./create')
  return <NextAppClient page={page} />
}
