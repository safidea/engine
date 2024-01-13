import { UIStyle } from '@entities/services/ui/UIStyle'

export interface BaseComponentUIProps {
  children: string | JSX.Element | (string | JSX.Element | JSX.Element | undefined)[]
  testId?: string
  style?: UIStyle
}
