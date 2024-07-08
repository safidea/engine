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

export const Center: Story = {
  args: {
    align: 'center',
    children: <div>Container with center aligned text</div>,
  },
}

export const Right: Story = {
  args: {
    align: 'right',
    children: <div>Container with right aligned text</div>,
  },
}

export const ExtraExtraLarge: Story = {
  args: {
    children: <div>Container with 2xl spacing and width</div>,
    spacing: '2xl',
    width: '2xl',
  },
}

export const ExtraLarge: Story = {
  args: {
    children: <div>Container with xl spacing and width</div>,
    spacing: 'xl',
    width: 'xl',
  },
}

export const Large: Story = {
  args: {
    children: <div>Container with lg spacing and width</div>,
    spacing: 'lg',
    width: 'lg',
  },
}

export const Medium: Story = {
  args: {
    children: <div>Container with md spacing and width</div>,
    spacing: 'md',
    width: 'md',
  },
}

export const Small: Story = {
  args: {
    children: <div>Container with sm spacing and width</div>,
    spacing: 'sm',
    width: 'sm',
  },
}

export const ExtraSmall: Story = {
  args: {
    children: <div>Container with xs spacing and width</div>,
    spacing: 'xs',
    width: 'xs',
  },
}

export const NoneSpacing: Story = {
  args: {
    children: <div>Container with xs spacing and width</div>,
    spacing: 'none',
    width: 'xs',
  },
}
