import { ParagraphComponentUI } from '@entities/app/page/component/paragraph/ParagraphComponentUI'
import TailwindUI from '../index'

import type { Meta, StoryObj } from '@storybook/react'

import { UIMapper } from '@adapters/mappers/ui/UIMapper'
import { UIService } from '@entities/services/ui/UIService'

const ui = new UIService(new UIMapper(TailwindUI))

const meta: Meta<typeof ParagraphComponentUI> = {
  title: 'Tailwind/Paragraph',
  component: ({ text, size }) => <ParagraphComponentUI text={text} size={size} ui={ui} />,
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
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
