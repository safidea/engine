import type { Meta, StoryObj } from '@storybook/react'

import TitleTailwindUI from '@drivers/ui/TailwindUI/TitleTailwindUI'
import { Title } from '@entities/app/page/component/common/title/TitleComponent'

const meta: Meta<typeof Title> = {
  title: 'Tailwind/Title',
  component: ({ text, size }) => <Title text={text} size={size} UI={TitleTailwindUI} />,
  args: {
    text: 'This is a title',
    size: 'medium',
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
    size: 'extra-small',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
  },
}

export const ExtraLarge: Story = {
  args: {
    size: 'extra-large',
  },
}
