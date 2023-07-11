export type CommonProps = {
  children?: React.ReactNode
  tag?: string
  router?: {
    push: (path: string) => void
  }
  pathParams?: Record<string, string>
  pathname?: string
}
