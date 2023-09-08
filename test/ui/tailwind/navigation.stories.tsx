import type { Meta, StoryObj } from '@storybook/react'

import LinkTailwindUI from '@infrastructure/ui/TailwindUI/LinkTailwindUI'
import TitleTailwindUI from '@infrastructure/ui/TailwindUI/TitleTailwindUI'
import NavigationTailwindUI from '@infrastructure/ui/TailwindUI/NavigationTailwindUI'
import { NavigationComponent } from '@domain/entities/page/components/Navigation'
import { Title } from '@domain/entities/page/components/TitleComponent'
import { LinkComponent } from '@domain/entities/page/components/Link'

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
