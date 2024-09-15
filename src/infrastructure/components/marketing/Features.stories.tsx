import type { Meta, StoryObj } from '@storybook/react'
import { Features } from './Features'
import { Title } from '../content/Title'
import { Paragraph } from '../content/Paragraph'
import { Icon } from '../content/Icon'
import type { BaseProps } from '@domain/entities/Component/base'
import {
  BanknotesIcon,
  ChartBarSquareIcon,
  ChatBubbleLeftEllipsisIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline'

const meta = {
  title: 'Marketing/Features',
  component: Features,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Features>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    Title: (props) => <Title text="Designed for business teams like yours" {...props} />,
    Paragraph: (props) => (
      <Paragraph
        text="Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth."
        {...props}
      />
    ),
    Features: [
      {
        Title: (props) => <Title text="Marketing" {...props} />,
        Paragraph: (props) => (
          <Paragraph
            text="Plan it, create it, launch it. Collaborate seamlessly with all the organization and hit your marketing goals every month with our marketing plan."
            {...props}
          />
        ),
        Icon: () => <Icon Icon={(props: BaseProps) => <ChartBarSquareIcon {...props} />} />,
      },
      {
        Title: (props) => <Title text="Sales" {...props} />,
        Paragraph: (props) => (
          <Paragraph
            text="Get your sales team aligned and hit your sales goals every month with our sales plan."
            {...props}
          />
        ),
        Icon: () => <Icon Icon={(props: BaseProps) => <BanknotesIcon {...props} />} />,
      },
      {
        Title: (props) => <Title text="Customer Success" {...props} />,
        Paragraph: (props) => (
          <Paragraph
            text="Keep your customers happy and engaged with our customer success plan."
            {...props}
          />
        ),
        Icon: () => <Icon Icon={(props: BaseProps) => <ChatBubbleLeftEllipsisIcon {...props} />} />,
      },
      {
        Title: (props) => <Title text="Product" {...props} />,
        Paragraph: (props) => (
          <Paragraph
            text="Build and launch products that people love. Collaborate with your team and hit your product goals every month with our product plan."
            {...props}
          />
        ),
        Icon: () => <Icon Icon={(props: BaseProps) => <ComputerDesktopIcon {...props} />} />,
      },
    ],
  },
}
