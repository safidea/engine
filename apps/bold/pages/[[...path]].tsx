import { GetStaticProps, GetStaticPaths, GetStaticPropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Locale from '../core/locale/locale'
import Page from '../core/page/page'
import Theme from '../core/theme/theme'
import { Meta, Layout } from '../core/page/page'
import app from '../core/.config/app.json'

import type { PageInterface } from '../core/page/page.interfaces'
import type { AppInterface } from '../core/build/build.interfaces'

const { defaultLocale } = app as AppInterface

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { path: string[] }; locale: string }[] = []
  const locales = Locale.getLocales()
  Page.getPaths().forEach((pathString: string) => {
    locales.forEach((locale: string) => {
      const path = pathString === 'home' ? [] : pathString.split('/')
      paths.push({
        params: { path },
        locale,
      })
    })
  })
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({
  params,
  locale = defaultLocale,
}: GetStaticPropsContext) => {
  const path =
    params && (Array.isArray(params.path) ? params.path.join('/') : params.path ?? 'home')
  const props = Page.getPage(path)
  const domain = process.env.HOST
  const theme = Theme.getPageTheme()
  const namespaces = Locale.getNamespaces(locale)
  if (!domain) throw new Error('Environment variable HOST is not set.')
  return {
    props: {
      ...(await serverSideTranslations(locale, namespaces)),
      ...props,
      domain,
      theme,
      namespaces,
    },
  }
}

export default function Document(props: PageInterface) {
  const { components, theme, namespaces, ...meta } = props
  return (
    <>
      <Meta {...meta} />
      <Layout components={components} theme={theme} namespaces={namespaces ?? []} />
    </>
  )
}
