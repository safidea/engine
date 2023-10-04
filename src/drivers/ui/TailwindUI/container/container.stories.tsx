import { ContainerComponentUI } from '@entities/app/page/component/container/ContainerComponentUI'
import { TailwindUI } from '../index'

import type { Meta, StoryObj } from '@storybook/react'
import { UIMapper } from '@adapters/mappers/ui/UIMapper'
import { UIService } from '@entities/services/ui/UIService'
import { TitleComponentUI } from '@entities/app/page/component/title/TitleComponentUI'
import { HeroiconsIcon } from '@drivers/icon/HeroiconsIcon'

const ui = new UIService(new UIMapper(new TailwindUI(new HeroiconsIcon())))
const SmallTitle = () => <TitleComponentUI text="This is a title" size="medium" ui={ui} />

const meta: Meta<typeof ContainerComponentUI> = {
  title: 'Tailwind/Container',
  component: () => <ContainerComponentUI ui={ui} Components={[SmallTitle]} />,
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
