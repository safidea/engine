import { ConfigError } from '@domain/entities/error/Config'
import type { Base, BaseProps } from './base/base'

export interface Props extends BaseProps {
  block: string
}

interface Params {
  props: Props
}

export class InvalidBlock implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {}

  render = async () => {
    const { props } = this.params
    return () => <>Block {props.block} does not exist</>
  }

  validateConfig = () => {
    const { props } = this.params
    return [
      new ConfigError({
        message: `Block ${props.block} does not exist'`,
      }),
    ]
  }
}
