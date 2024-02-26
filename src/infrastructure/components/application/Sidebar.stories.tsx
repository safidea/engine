import type { Meta, StoryObj } from '@storybook/react'
import { Sidebar } from './Sidebar'

const meta = {
  title: 'Application/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Menu',
    links: [
      {
        label: 'Home',
        beforeIcon: 'Home',
        href: '/',
      },
      {
        label: 'Leads',
        beforeIcon: 'Users',
        href: '/leads',
      },
    ],
    children: <p>Some children</p>,
  },
}
