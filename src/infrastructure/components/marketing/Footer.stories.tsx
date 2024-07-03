import type { Meta, StoryObj } from '@storybook/react'
import { Footer } from './Footer'
import { Title } from '../content/Title'
import { Paragraph } from '../content/Paragraph'
import { Link } from '../content/Link'

const meta = {
  title: 'Marketing/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    Title: (props) => <Title text="Request" {...props} />,
    Paragraph: (props) => (
      <Paragraph
        text="Open-source library of over 400+ web components and interactive elements built for better web."
        {...props}
      />
    ),
    Links: [
      (props) => <Link label="About" href="#" {...props} />,
      (props) => <Link label="Pricing" href="#" {...props} />,
      (props) => <Link label="Contact" href="#" {...props} />,
      (props) => <Link label="Careers" href="#" {...props} />,
      (props) => <Link label="Press" href="#" {...props} />,
      (props) => <Link label="Blog" href="#" {...props} />,
    ],
    copyright: '© 2021-2022 Request. All Rights Reserved.',
  },
}
