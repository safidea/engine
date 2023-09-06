import type { Meta, StoryObj } from '@storybook/react'

import TitleTailwindUI from '@infrastructure/ui/TailwindUI/TitleTailwindUI'
import { TitleComponent } from '@domain/entities/page/components/Title'

const meta: Meta<typeof TitleComponent> = {
  title: 'Tailwind/Title',
  component: ({ text, size }) => <TitleComponent text={text} size={size} UI={TitleTailwindUI} />,
  args: {
    text: 'This is a title',
    size: 'md',
  },
  argTypes: {
    text: {
      control: { type: 'text' },
    },
    size: {
      control: false,
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
  },
}

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

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
}
