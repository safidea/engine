import { TitleComponentUI } from '@entities/app/page/component/title/TitleComponentUI'
import { TailwindUI } from '../index'

import type { Meta, StoryObj } from '@storybook/react'
import { UIMapper } from '@adapters/mappers/ui/UIMapper'
import { UIService } from '@entities/services/ui/UIService'
import { HeroiconsIcon } from '@drivers/icon/HeroiconsIcon'

const ui = new UIService(new UIMapper(new TailwindUI(new HeroiconsIcon())))

const meta: Meta<typeof TitleComponentUI> = {
  title: 'Tailwind/Title',
  component: ({ text, size }) => <TitleComponentUI text={text} size={size} ui={ui} />,
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
