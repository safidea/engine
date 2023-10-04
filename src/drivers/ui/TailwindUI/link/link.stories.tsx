import type { Meta, StoryObj } from '@storybook/react'

import { LinkComponentUI } from '@entities/app/page/component/link/LinkComponentUI'
import TailwindUI from '../index'

import { UIMapper } from '@adapters/mappers/ui/UIMapper'
import { UIService } from '@entities/services/ui/UIService'

const ui = new UIService(new UIMapper(TailwindUI))

const meta: Meta<typeof LinkComponentUI> = {
  title: 'Tailwind/Link',
  component: ({ path, text, display }) => (
    <LinkComponentUI path={path} text={text} ui={ui} display={display} />
  ),
  args: {
    path: '#',
    text: 'Open a page',
  },
  argTypes: {
    path: {
      control: { type: 'text' },
    },
    text: {
      control: { type: 'text' },
    },
    display: {
      control: false,
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const PrimaryButton: Story = {
  args: {
    display: 'primary-button',
  },
}

export const SecondaryButton: Story = {
  args: {
    display: 'secondary-button',
  },
}
