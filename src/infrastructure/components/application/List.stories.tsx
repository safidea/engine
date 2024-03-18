import type { Meta, StoryObj } from '@storybook/react'
import { List } from './List'

const meta = {
  title: 'Application/List',
  component: List,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    columns: [
      {
        name: 'name',
      },
      {
        name: 'age',
      },
      {
        name: 'address',
      },
    ],
    rows: [
      {
        data: { name: 'John Doe', age: 25, address: '123 Main St' },
        open: '/user/1',
      },
      {
        data: {
          name: 'Jane Doe',
          age: 24,
          address: '456 Elm St',
        },
        open: '/user/2',
      },
      {
        data: {
          name: 'Joe Doe',
          age: 26,
          address: '789 Oak St',
        },
        open: '/user/3',
      },
    ],
  },
}
