import { PageComponent, PageComponentProps } from 'client-page'

export default function AppClient({ page, serverProviderComponents }: PageComponentProps) {
  return <PageComponent serverProviderComponents={serverProviderComponents} page={page} />
}
