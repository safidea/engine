import { lazy } from 'react'
import LANDING_CONFIG from '@examples/landing/config'
import { Context } from '@entities/app/page/context/Context'
import type { Meta, StoryObj } from '@storybook/react'
import { ClientMiddleware } from '@adapters/middlewares/client/ClientMiddleware'
import { getFetcherDriver } from '@drivers/fetcher'
import { getUIDriver } from '@drivers/ui'

const ui = getUIDriver('tailwind')
const fetcher = getFetcherDriver('native', { domain: window.location.origin })
const clientMiddleware = new ClientMiddleware({ ui, fetcher }, {})
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
