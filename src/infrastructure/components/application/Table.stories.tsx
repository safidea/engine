import type { Meta, StoryObj } from '@storybook/react'
import { Table } from './Table'
import { Button } from '../base/Button'
import { Title } from '../content/Title'

const meta = {
  title: 'Application/Table',
  component: Table,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    columns: [
      {
        label: 'Name',
        name: 'name',
      },
      {
        label: 'Age',
        name: 'age',
      },
      {
        label: 'Address',
        name: 'address',
      },
    ],
    rows: [
      {
        name: 'John Doe',
        age: 25,
        address: '123 Main St',
      },
      {
        name: 'Jane Doe',
        age: 24,
        address: '456 Elm St',
      },
      {
        name: 'Joe Doe',
        age: 26,
        address: '789 Oak St',
      },
    ],
  },
}

export const WithAddButton: Story = {
  args: {
    ...Default.args,
    Buttons: [(props) => <Button variant="primary" href="/add" label="Add" {...props} />],
  },
}

export const WithTitle: Story = {
  args: {
    ...Default.args,
    Title: (props) => <Title text="Users" {...props} />,
  },
}
