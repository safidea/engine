import { ConfigError } from '@domain/entities/error/Config'
import type { Base, BaseProps } from './base'

export interface Props extends BaseProps {
  message: string
}

interface Params extends Props {}

export class InvalidBlock implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {}

  render = async () => {
    const { message } = this.params
    return () => <>{message}</>
  }

  validateConfig = () => {
    const { message } = this.params
    return [
      new ConfigError({
        message,
      }),
    ]
  }
}
