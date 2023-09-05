import type { Meta, StoryObj } from '@storybook/react'

import TitleTailwindUI from '@infrastructure/ui/TailwindUI/TitleTailwindUI'

const meta: Meta<typeof TitleTailwindUI.xs> = {
  component: TitleTailwindUI.xs,
}

export default meta

type Story = StoryObj<typeof meta>

export const XS: Story = {
  render: () => <TitleTailwindUI.xs>XS Title</TitleTailwindUI.xs>,
}

export const SM: Story = {
  render: () => <TitleTailwindUI.sm>SM Title</TitleTailwindUI.sm>,
}

export const MD: Story = {
  render: () => <TitleTailwindUI.md>MD Title</TitleTailwindUI.md>,
}

export const LG: Story = {
  render: () => <TitleTailwindUI.lg>LG Title</TitleTailwindUI.lg>,
}

export const XL: Story = {
  render: () => <TitleTailwindUI.xl>XL Title</TitleTailwindUI.xl>,
}
