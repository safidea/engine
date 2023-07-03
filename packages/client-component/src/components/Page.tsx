import { SWRConfig } from 'swr'

export type PageProps = {
  children?: React.ReactNode
}

export default function Page({ children }: PageProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (url, init) => fetch(url, init).then((res) => res.json()),
      }}
    >
      {children}
    </SWRConfig>
  )
}
