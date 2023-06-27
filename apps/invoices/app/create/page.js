import NextAppClient from '../client'
import NextAppServer from '../server'

export const metadata = {
  title: 'Factures',
}

export default function Page() {
  const page = NextAppServer.getConfigFromPath('pages./create')
  return <NextAppClient page={page} />
}
