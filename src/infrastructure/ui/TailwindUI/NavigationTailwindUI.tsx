import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { IUISpi } from '@domain/spi/IUISpi'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const NavigationTailwindUI: IUISpi['NavigationUI'] = {
  container: ({ children }) => {
    return <div>{children}</div>
  },
  sidebar: ({ children }) => {
    return <nav>{children}</nav>
  },
  links: ({ children }) => {
    return <ul>{children}</ul>
  },
  link: ({ children }) => {
    return <li>{children}</li>
  },
  content: ({ children }) => {
    return <div>{children}</div>
  },
}

export default NavigationTailwindUI
