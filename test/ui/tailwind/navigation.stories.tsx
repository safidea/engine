import type { Meta, StoryObj } from '@storybook/react'

import LinkTailwindUI from '@drivers/ui/TailwindUI/LinkTailwindUI'
import TitleTailwindUI from '@drivers/ui/TailwindUI/TitleTailwindUI'
import NavigationTailwindUI from '@drivers/ui/TailwindUI/NavigationTailwindUI'
import { NavigationComponent } from '@entities/app/page/component/common/navigation/Navigation'
import { Title } from '@entities/app/page/component/common/title/TitleComponent'
import { LinkComponent } from '@entities/app/page/component/common/link/Link'

const SmallTitle = () => <Title text="title" size="small" UI={TitleTailwindUI} />
const BigTitle = () => <Title text="title" size="large" UI={TitleTailwindUI} />
const Link = () => <LinkComponent path="/new-page" label="New page" UI={LinkTailwindUI} />

const meta: Meta<typeof NavigationComponent> = {
  title: 'Tailwind/Navigation',
  component: () => (
    <NavigationComponent
      UI={NavigationTailwindUI}
      TitleComponent={SmallTitle}
      LinksComponent={[Link]}
      Components={[BigTitle]}
    />
  ),
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
