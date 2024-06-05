import type { Meta, StoryObj } from '@storybook/react'
import { Paragraph } from './Paragraph'

const meta = {
  title: 'Base/Paragraph',
  component: Paragraph,
} satisfies Meta<typeof Paragraph>

export default meta
type Story = StoryObj<typeof meta>

export const Left: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
  },
}

export const Center: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    align: 'center',
  },
}

export const Right: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    align: 'right',
  },
}

export const ExtraExtraLarge: Story = {
  args: {
    text: 'Paragraph (2xl)',
    size: '2xl',
  },
}

export const ExtraLarge: Story = {
  args: {
    text: 'Paragraph (xl)',
    size: 'xl',
  },
}

export const Large: Story = {
  args: {
    text: 'Paragraph (lg)',
    size: 'lg',
  },
}

export const Medium: Story = {
  args: {
    text: 'Paragraph (md)',
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    text: 'Paragraph (sm)',
    size: 'sm',
  },
}

export const ExtraSmall: Story = {
  args: {
    text: 'Paragraph (xs)',
    size: 'xs',
  },
}
