import type { Meta, StoryObj } from '@storybook/react'

import { ButtonComponentUI } from '@entities/app/page/component/button/ButtonComponentUI'
import TailwindUI from '../index'

import { UIMapper } from '@adapters/mappers/ui/UIMapper'
import { UIService } from '@entities/services/ui/UIService'

const ui = new UIService(new UIMapper(TailwindUI))

const meta: Meta<typeof ButtonComponentUI> = {
  title: 'Tailwind/Button',
  component: ({ text }) => <ButtonComponentUI ui={ui} text={text} />,
  args: {
    text: 'Open a page',
  },
  argTypes: {
    text: {
      control: { type: 'text' },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
