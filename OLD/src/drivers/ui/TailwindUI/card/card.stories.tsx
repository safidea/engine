import { CardComponentUI } from '@entities/app/page/component/card/CardComponentUI'
import { TailwindUI } from '../index'

import type { Meta, StoryObj } from '@storybook/react'
import { UIMapper } from '@adapters/mappers/ui/UIMapper'
import { UIService } from '@entities/services/ui/UIService'
import { HeroiconsIcon } from '@drivers/icon/HeroiconsIcon'
import { TitleComponentUI } from '@entities/app/page/component/title/TitleComponentUI'

const ui = new UIService(new UIMapper(new TailwindUI(new HeroiconsIcon())))

const Title = () => <TitleComponentUI text="First title" size="medium" ui={ui} />

const meta: Meta<typeof CardComponentUI> = {
  title: 'Tailwind/Card',
  component: () => <CardComponentUI ui={ui} Components={[Title]} />,
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
