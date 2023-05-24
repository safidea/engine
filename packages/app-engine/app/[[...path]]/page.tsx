import { notFound } from 'next/navigation'
import { PageService as ClientPageService } from 'client-page'
import { PageRoute as ServerPageRoute } from 'server-page'

export async function generateStaticParams() {
  return ServerPageRoute.generateStaticPaths()
}

export async function generateMetadata({ params }) {
  return ServerPageRoute.generateMetadata(params)
}

export default function Page({ params }) {
  const components = ServerPageRoute.generateComponents(params)
  if (!components) notFound()
  const PageRendered = ClientPageService.render(components)
  return <PageRendered />
}
