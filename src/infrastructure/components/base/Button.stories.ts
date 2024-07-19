import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta = {
  title: 'Base/Button',
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    label: 'Primary',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    label: 'Secondary',
    variant: 'secondary',
  },
}
