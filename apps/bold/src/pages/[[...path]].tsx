import { GetStaticProps, GetStaticPaths, GetStaticPropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { getLocales, getNamespaces, getPaths, getPage } from '../utils'
import { app } from '../config'
import Meta from '../components/meta'
import Layout from '../components/layout'

import type { App, Page } from 'bold-config'

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
  meta.domain = process.env.HOST
  if (!meta.domain) throw new Error('Environment variable HOST is not set.')
  return {
    props: {
      ...(await serverSideTranslations(locale, getNamespaces(locale))),
      components,
      meta,
    },
  }
}

export default function Document(props: Page) {
  const { meta, components } = props
  return (
    <>
      <Meta {...meta} />
      <Layout components={components} />
    </>
  )
}
