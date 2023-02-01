import { GetStaticProps, GetStaticPaths, GetStaticPropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { getLocales, getNamespaces } from 'bold-locale'
import { getPaths, getPage } from 'bold-page'
import { app, theme } from 'bold-build'

import type { Page } from 'bold-page'
import type { App } from 'bold-config'

import fonts from '../src/fonts'
import Meta from '../src/components/meta'
import Layout from '../src/components/layout'

const { defaultLocale } = app as App

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { path: string[] }; locale: string }[] = []
  const locales = getLocales()
  getPaths().forEach((pathString: string) => {
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
  const { meta, components } = getPage(path)
  const namespaces = getNamespaces(locale)
  meta.domain = process.env.HOST
  if (!meta.domain) throw new Error('Environment variable HOST is not set.')
  return {
    props: {
      ...(await serverSideTranslations(locale, namespaces)),
      components,
      meta,
      namespaces,
      fontsVariables: fonts,
      hasContainer: !!theme.container,
    },
  }
}

export default function Document(props: Page) {
  const { meta, ...layout } = props
  return (
    <>
      <Meta {...meta} />
      <Layout {...layout} />
    </>
  )
}
