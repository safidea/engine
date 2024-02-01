import type { Meta, StoryObj } from '@storybook/react'
import { Footer } from './Footer'

const meta = {
  title: 'Marketing/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Request',
    description:
      'Open-source library of over 400+ web components and interactive elements built for better web.',
    links: [
      {
        label: 'About us',
        href: '#',
      },
      {
        label: 'Careers',
        href: '#',
      },
      {
        label: 'Press',
        href: '#',
      },
      {
        label: 'Blog',
        href: '#',
      },
    ],
    copyright: '© 2021-2022 Request. All Rights Reserved.',
  },
}
