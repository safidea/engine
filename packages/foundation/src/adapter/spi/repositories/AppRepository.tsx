import { AppDto } from '@application/dtos/AppDto'
import { ResponseDto } from '@application/dtos/ResponseDto'
import { getSchema } from '@infrastructure/config/Schema'
import * as Components from '@infrastructure/client/components'
import type { HtmlProps } from '@infrastructure/client/components'
import { ReactElement } from 'react'

export class AppRepository {
  async getSchema(): Promise<AppDto> {
    return getSchema()
  }

  async requestRoute(): Promise<ResponseDto> {
    return { message: 'Hello World!' }
  }

  getComponents(): Record<string, (props: HtmlProps) => ReactElement> {
    return Components
  }
}
