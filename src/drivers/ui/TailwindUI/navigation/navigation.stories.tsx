import { LinkComponentUI } from '@entities/app/page/component/link/LinkComponentUI'
import { NavigationComponentUI } from '@entities/app/page/component/navigation/NavigationComponentUI'
import { TitleComponentUI } from '@entities/app/page/component/title/TitleComponentUI'
import { TailwindUI } from '../index'

import type { Meta, StoryObj } from '@storybook/react'

import { UIMapper } from '@adapters/mappers/ui/UIMapper'
import { UIService } from '@entities/services/ui/UIService'
import { HeroiconsIcon } from '@drivers/icon/HeroiconsIcon'

const ui = new UIService(new UIMapper(new TailwindUI(new HeroiconsIcon())))

const SmallTitle = () => <TitleComponentUI text="title" size="small" ui={ui} />
const BigTitle = () => <TitleComponentUI text="title" size="large" ui={ui} />
const Link = () => <LinkComponentUI path="/new-page" text="New page" ui={ui} />

const meta: Meta<typeof NavigationComponentUI> = {
  title: 'Tailwind/Navigation',
  component: () => (
    <NavigationComponentUI ui={ui} Title={SmallTitle} Links={[Link]} Components={[BigTitle]} />
  ),
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
