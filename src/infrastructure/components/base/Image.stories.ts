import type { Meta, StoryObj } from '@storybook/react'
import { Image } from './Image'

const meta = {
  title: 'Base/Image',
  component: Image,
} satisfies Meta<typeof Image>

export default meta
type Story = StoryObj<typeof meta>

export const ExtraExtraLarge: Story = {
  args: {
    rounded: 'xl',
    src: 'https://via.placeholder.com/150',
    alt: 'Image (2xl)',
    size: '2xl',
  },
}

export const ExtraLarge: Story = {
  args: {
    src: 'https://via.placeholder.com/150',
    alt: 'Image (xl)',
    size: 'xl',
    align: 'center',
  },
}

export const Large: Story = {
  args: {
    rounded: 'lg',
    src: 'https://via.placeholder.com/150',
    alt: 'Image (lg)',
    size: 'lg',
    align: 'right',
  },
}

export const Medium: Story = {
  args: {
    rounded: 'md',
    src: 'https://via.placeholder.com/150',
    alt: 'Image (md)',
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    src: 'https://via.placeholder.com/150',
    alt: 'Image (sm)',
    size: 'sm',
  },
}

export const ExtraSmall: Story = {
  args: {
    src: 'https://via.placeholder.com/150',
    alt: 'Image (xs)',
    size: 'xs',
  },
}
