import type { Meta, StoryObj } from '@storybook/react'
import { NotFound } from './NotFound'

const meta = {
  title: 'Marketing/NotFound',
  component: NotFound,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NotFound>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Something\'s missing.',
    description: "Sorry, we can't find that page. You'll find lots to explore on the home page.",
    primaryButton: {
      label: 'Back to Homepage',
      href: '/',
    },
  },
}
