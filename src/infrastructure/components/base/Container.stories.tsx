import type { Meta, StoryObj } from '@storybook/react'
import { Container } from './Container'

const meta = {
  title: 'Base/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

export const Left: Story = {
  args: {
    children: <div>Container with left aligned text</div>,
  },
}

export const Center: Story = {
  args: {
    textAlign: 'center',
    children: <div>Container with center aligned text</div>,
  },
}

export const Right: Story = {
  args: {
    textAlign: 'right',
    children: <div>Container with right aligned text</div>,
  },
}
