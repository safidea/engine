import type { Meta, StoryObj } from '@storybook/react'
import { Columns } from './Columns'
import { Title } from './Title'
import type { Props as TitleProps } from '@domain/engine/page/component/base/Title'

const meta = {
  title: 'Base/Columns',
  component: Columns,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Columns>

export default meta
type Story = StoryObj<typeof meta>

export const One: Story = {
  args: {
    columnsNumber: 1,
    Components: [
      (props: Partial<TitleProps>) => <Title text="First column" align="center" {...props} />,
    ],
  },
}

export const Two: Story = {
  args: {
    columnsNumber: 2,
    Components: [
      (props: Partial<TitleProps>) => <Title text="First column" align="center" {...props} />,
      (props: Partial<TitleProps>) => <Title text="Second column" align="center" {...props} />,
    ],
  },
}

export const Three: Story = {
  args: {
    columnsNumber: 3,
    Components: [
      (props: Partial<TitleProps>) => <Title text="First column" align="center" {...props} />,
      (props: Partial<TitleProps>) => <Title text="Second column" align="center" {...props} />,
      (props: Partial<TitleProps>) => <Title text="Third column" align="center" {...props} />,
    ],
  },
}
