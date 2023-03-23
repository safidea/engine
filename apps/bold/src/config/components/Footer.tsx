// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import type { Component } from 'foundation-page'

export default function Footer({ props }: Component) {
  const { navigation } = props

  const { t } = useTranslation()

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden py-20 px-6 sm:py-24 lg:px-8">
        <nav
          aria-label="Footer"
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
        >
          {navigation.map((item) => (
            <div key={item.key} className="pb-6">
              <Link
                href={item.path}
                className="text-sm leading-6 text-gray-600 hover:text-gray-900"
              >
                {t(`header.navigation.${item.key}`)}
              </Link>
            </div>
          ))}
        </nav>
        <p className="mt-10 text-center text-xs leading-5 text-gray-500">{t('footer.copyright')}</p>
      </div>
    </footer>
  )
}
