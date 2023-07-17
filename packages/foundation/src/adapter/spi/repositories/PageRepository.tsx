import * as Components from '@infrastructure/client/components'
import { HtmlProps } from '@infrastructure/client/components'
import { ReactElement } from 'react'

export class PageRepository {
  getComponents(): Record<string, (props: HtmlProps) => ReactElement> {
    return Components
  }
}
