import type { Meta, StoryObj } from '@storybook/react'
import { Container } from './Container'

const meta = {
  title: 'Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <div>Container with left aligned text</div>,
  },
}

export const Centered: Story = {
  args: {
    children: <div>Container with centered text</div>,
    center: true,
  },
}
