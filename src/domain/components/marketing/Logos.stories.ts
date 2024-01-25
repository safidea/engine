import type { Meta, StoryObj } from '@storybook/react'
import { Logos } from './Logos'

const meta = {
  title: 'Marketing/Logos',
  component: Logos,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Logos>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'You’ll be in good company',
    logos: [
      {
        alt: 'Agorastore',
        src: '/logos/agorastore.jpeg',
      },
      {
        alt: 'Capital PV',
        src: '/logos/capital-pv.png',
      },
      {
        alt: 'Codesign-it',
        src: '/logos/codesign-it.png',
      },
      {
        alt: 'dun-seul-geste',
        src: '/logos/dun-seul-geste.png',
      },
      {
        alt: "L'intendance",
        src: '/logos/lintendance.png',
      },
    ],
  },
}
