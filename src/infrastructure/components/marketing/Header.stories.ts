import type { Meta, StoryObj } from '@storybook/react'
import { Header } from './Header'

const meta = {
  title: 'Marketing/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Request',
    links: [
      {
        label: 'Home',
        href: '#',
      },
      {
        label: 'About',
        href: '#',
      },
      {
        label: 'Services',
        href: '#',
      },
      {
        label: 'Contact',
        href: '#',
      },
    ],
    buttons: [
      {
        label: 'Log in',
        href: '#',
        variant: 'secondary',
      },
      {
        label: 'Sign up',
        href: '#',
      },
    ],
  },
}
