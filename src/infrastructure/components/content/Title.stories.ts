import type { Meta, StoryObj } from '@storybook/react'
import { Title } from './Title'

const meta = {
  title: 'Content/Title',
  component: Title,
} satisfies Meta<typeof Title>

export default meta
type Story = StoryObj<typeof meta>

export const ExtraExtraLarge: Story = {
  args: {
    text: 'Title (2xl)',
    size: '2xl',
  },
}

export const ExtraLarge: Story = {
  args: {
    text: 'Title (xl)',
    size: 'xl',
  },
}

export const Large: Story = {
  args: {
    text: 'Title (lg)',
    size: 'lg',
  },
}

export const Medium: Story = {
  args: {
    text: 'Title (md)',
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    text: 'Title (sm)',
    size: 'sm',
  },
}

export const ExtraSmall: Story = {
  args: {
    text: 'Title (xs)',
    size: 'xs',
  },
}
