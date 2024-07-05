import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Icon = ({ className = '', Icon }: Props['Icon']) => {
  return <Icon className={classNames('w-6 h-6', className)} data-component="Icon" />
}
