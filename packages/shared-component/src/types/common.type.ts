export type CommonProps = {
  children?: React.ReactNode
  tag?: string
  router?: {
    push: (path: string) => void
  }
}
