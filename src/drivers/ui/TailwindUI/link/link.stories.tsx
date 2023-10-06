import type { Meta, StoryObj } from '@storybook/react'

import { LinkComponentUI } from '@entities/app/page/component/link/LinkComponentUI'
import { TailwindUI } from '../index'

import { UIMapper } from '@adapters/mappers/ui/UIMapper'
import { UIService } from '@entities/services/ui/UIService'
import { HeroiconsIcon } from '@drivers/icon/HeroiconsIcon'

const ui = new UIService(new UIMapper(new TailwindUI(new HeroiconsIcon())))

const meta: Meta<typeof LinkComponentUI> = {
  title: 'Tailwind/Link',
  component: ({ path, text, size, display }) => (
    <LinkComponentUI path={path} text={text} ui={ui} size={size} display={display} />
  ),
  args: {
    path: '#',
    text: 'Open a page',
    size: 'medium',
    display: 'link',
  },
  argTypes: {
    path: {
      control: { type: 'text' },
    },
    text: {
      control: { type: 'text' },
    },
    size: {
      options: ['extra-small', 'small', 'medium', 'large', 'extra-large'],
    },
    display: {
      options: ['primary-button', 'secondary-button', 'link'],
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
