import type { Meta, StoryObj } from '@storybook/react'

import { LinkComponentUI } from '@entities/app/page/component/link/LinkComponentUI'
import TailwindUI from '../index'
import { UIService } from '@adapters/services/ui/UIService'

const ui = new UIService(TailwindUI)

const meta: Meta<typeof LinkComponentUI> = {
  title: 'Tailwind/Link',
  component: ({ path, label }) => <LinkComponentUI path={path} label={label} ui={ui} />,
  args: {
    path: '/new-page',
    label: 'Open a page',
  },
  argTypes: {
    path: {
      control: { type: 'text' },
    },
    label: {
      control: { type: 'text' },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
