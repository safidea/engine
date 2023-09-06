import type { Meta, StoryObj } from '@storybook/react'

import ParagraphTailwindUI from '@infrastructure/ui/TailwindUI/ParagraphTailwindUI'
import { ParagraphComponent } from '@domain/entities/page/components/Paragraph'

const meta: Meta<typeof ParagraphComponent> = {
  title: 'Tailwind/Paragraph',
  component: ({ text, size }) => (
    <ParagraphComponent text={text} size={size} UI={ParagraphTailwindUI} />
  ),
  args: {
    text: 'Title',
  },
  argTypes: {
    text: {
      control: { type: 'text' },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}