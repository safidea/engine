import type { Meta, StoryObj } from '@storybook/react'
import { Sidebar } from './Sidebar'
import { Table } from './Table'
import { Button } from '../base/Button'

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

export const WithTable: Story = {
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
    children: (
      <Table
        title="Table"
        AddButton={<Button label="Add row" />}
        columns={[{ name: 'email', label: 'Email' }]}
        rows={[{ email: 'test@test.com' }]}
      />
    ),
  },
}
