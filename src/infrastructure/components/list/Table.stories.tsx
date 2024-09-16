import type { Meta, StoryObj } from '@storybook/react'
import { Table } from './Table'
import SAMPLES from './../../../domain/entities/Component/list/Table/samples.json'

const meta = {
  title: 'List/Table',
  component: Table,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const WithoutRows: Story = {
  args: SAMPLES.WITHOUT_ROWS,
}

export const WithRows: Story = {
  args: SAMPLES.WITH_ROWS,
}
