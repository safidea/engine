import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta = {
  title: 'Base/Input',
  component: Input,
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'input',
    type: 'text',
    label: 'Input',
    placeholder: 'This is an input',
    required: true,
  },
}
