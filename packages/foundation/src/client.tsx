import { PageComponent, PageComponentProps } from 'client-page'

export default function AppClient({ page, appProviderComponents }: PageComponentProps) {
  return <PageComponent appProviderComponents={appProviderComponents} page={page} />
}
