import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from './Modal'
import { Button } from '../base/Button'

const meta = {
  title: 'Application/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    Button: (props) => <Button label="Open modal" variant="primary" {...props} />,
    header: <p>Static modal</p>,
    body: (
      <p>
        With less than a month to go before the European Union enacts new consumer privacy laws for
        its citizens, companies around the world are updating their terms of service agreements to
        comply. The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect
        on May 25 and is meant to ensure a common set of data rights in the European Union. It
        requires organizations to notify users as soon as possible of high-risk data breaches that
        could personally affect them.
      </p>
    ),
    footer: <p>Footer</p>,
  },
}
