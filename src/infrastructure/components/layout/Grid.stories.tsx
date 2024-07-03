import type { Meta, StoryObj } from '@storybook/react'
import { Grid } from './Grid'
import { Title } from '../content/Title'
import type { Props as TitleProps } from '@domain/engine/page/component/content/Title'

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Grid>

export default meta
type Story = StoryObj<typeof meta>

export const One: Story = {
  args: {
    columns: 3,
    Components: [
      (props: Partial<TitleProps>) => <Title text="First column" align="center" {...props} />,
    ],
  },
}

export const Three: Story = {
  args: {
    columns: 3,
    Components: [
      (props: Partial<TitleProps>) => <Title text="First column" align="center" {...props} />,
      (props: Partial<TitleProps>) => <Title text="Second column" align="center" {...props} />,
      (props: Partial<TitleProps>) => <Title text="Third column" align="center" {...props} />,
    ],
  },
}

export const Six: Story = {
  args: {
    columns: 3,
    Components: [
      (props: Partial<TitleProps>) => <Title text="First column" align="center" {...props} />,
      (props: Partial<TitleProps>) => <Title text="Second column" align="center" {...props} />,
      (props: Partial<TitleProps>) => <Title text="Third column" align="center" {...props} />,
      (props: Partial<TitleProps>) => <Title text="Fourth column" align="center" {...props} />,
      (props: Partial<TitleProps>) => <Title text="Fifth column" align="center" {...props} />,
      (props: Partial<TitleProps>) => <Title text="Sixth column" align="center" {...props} />,
    ],
  },
}
