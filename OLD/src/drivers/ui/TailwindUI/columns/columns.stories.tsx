import { ColumnsComponentUI } from '@entities/app/page/component/columns/ColumnsComponentUI'
import { TailwindUI } from '../index'

import type { Meta, StoryObj } from '@storybook/react'
import { UIMapper } from '@adapters/mappers/ui/UIMapper'
import { UIService } from '@entities/services/ui/UIService'
import { TitleComponentUI } from '@entities/app/page/component/title/TitleComponentUI'
import { HeroiconsIcon } from '@drivers/icon/HeroiconsIcon'

const ui = new UIService(new UIMapper(new TailwindUI(new HeroiconsIcon())))

const FirstTitle = () => <TitleComponentUI text="First title" size="medium" ui={ui} />
const SecondTitle = () => <TitleComponentUI text="Second title" size="medium" ui={ui} />
const ThirdTitle = () => <TitleComponentUI text="Third title" size="medium" ui={ui} />

const meta: Meta<typeof ColumnsComponentUI> = {
  title: 'Tailwind/Columns',
  component: () => (
    <ColumnsComponentUI ui={ui} Components={[FirstTitle, SecondTitle, ThirdTitle]} />
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
