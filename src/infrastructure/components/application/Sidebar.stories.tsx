import type { Meta, StoryObj } from '@storybook/react'
import { Sidebar } from './Sidebar'
import { Table } from '../list/Table'
import { Title } from '../content/Title'
import { Link } from '../content/Link'

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
    Title: (props) => <Title text="Leads" {...props} />,
    Links: [
      (props) => <Link label="Home" href="/" {...props} />,
      (props) => <Link label="Leads" href="/leads" {...props} />,
    ],
    children: <p>Some children</p>,
  },
}

export const WithActiveLink: Story = {
  args: {
    Title: (props) => <Title text="Leads" {...props} />,
    Links: [
      (props) => <Link label="Home" href="/" {...props} />,
      (props) => <Link label="Leads" href="/leads" {...props} active={true} />,
    ],
    children: <p>Some children</p>,
  },
}

export const WithTable: Story = {
  args: {
    Title: (props) => <Title text="Leads" {...props} />,
    Links: [
      (props) => <Link label="Home" href="/" {...props} />,
      (props) => <Link label="Leads" href="/leads" {...props} />,
    ],
    children: (
      <Table fields={[{ name: 'email', label: 'Email' }]} rows={[{ email: 'test@test.com' }]} />
    ),
  },
}
