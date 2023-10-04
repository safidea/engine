import { lazy } from 'react'
import LANDING_CONFIG from '@examples/landing/config'
import { Context } from '@entities/app/page/context/Context'
import type { Meta, StoryObj } from '@storybook/react'
import { ClientMiddleware } from '@adapters/middlewares/client/ClientMiddleware'
import { getFetcherDriver } from '@drivers/fetcher'
import { getUIDriver } from '@drivers/ui'
import { getIconDriver } from '@drivers/icon'

const icon = getIconDriver()
const ui = getUIDriver('tailwind', icon)
const fetcher = getFetcherDriver('native', { domain: window.location.origin })
const clientMiddleware = new ClientMiddleware({ ui, fetcher, icon }, {})
const app = clientMiddleware.getAppFromConfig(LANDING_CONFIG)
const PageComponent = lazy(async () => {
  const context = new Context({ path: { params: {} } })
  const Page = await app.pages.renderByPath('/', context)
  return { default: Page }
})

const meta: Meta<typeof PageComponent> = {
  title: 'Examples/Landing/Home',
  component: PageComponent,
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
