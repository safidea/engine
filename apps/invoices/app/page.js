import NextAppClient from './client'
    import NextAppServer from './server'
                
    export const metadata = {
  "title": "Factures"
}
    
    export default function Page() {
      const page = NextAppServer.getConfigFromPath('pages./')
      return <NextAppClient page={page} />
    }
    