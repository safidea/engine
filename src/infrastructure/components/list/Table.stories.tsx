import type { Meta, StoryObj } from '@storybook/react'
import { Table } from './Table'

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
    fields: [
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
