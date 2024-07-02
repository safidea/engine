import type { Meta, StoryObj } from '@storybook/react'
import { Spacer } from './Spacer'

const meta = {
  title: 'Base/Spacer',
  component: Spacer,
} satisfies Meta<typeof Spacer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
