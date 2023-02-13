// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import Link from 'next/link'
import { Bars3Icon } from '@heroicons/react/20/solid'
import { Popover } from '@headlessui/react'
import type { Component } from 'bold-page'

export default function Header({ props }: Component) {
  const { navigation, logo, buttons } = props

  const { t } = useTranslation()

  return (
    <Popover className="relative bg-white">
      <div className="flex items-center justify-between p-6 md:justify-start md:space-x-10">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <Link href="/">
            <span className="sr-only">{t('header.logoTitle')}</span>
            <Image
              src={logo.path}
              alt={t('header.logoTitle')}
              className="h-8 w-auto sm:h-10"
              width={logo.width}
              height={logo.height}
            />
          </Link>
        </div>
        <div className="-my-2 -mr-2 md:hidden">
          <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
            <span className="sr-only">{t('header.mobileMenu')}</span>
            <Bars3Icon aria-hidden={true} className="h-6 w-6" />
          </Popover.Button>
        </div>
        <Popover.Group as="nav" className="hidden space-x-10 md:flex">
          {navigation.map((item) => (
            <Link
              href={item.path}
              key={item.key}
              className="text-base font-medium text-gray-500 hover:text-gray-900"
            >
              {item.key}
            </Link>
          ))}
        </Popover.Group>
        <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
          <Link
            href={buttons.primary.path}
            className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700"
          >
            Sign up
          </Link>
        </div>
      </div>
    </Popover>
  )
}
