import type { Props } from '@domain/entities/Component'
import { classNames } from '../utils'

export const Icon = ({ className = '', Icon }: Props['Icon']) => {
  return <Icon className={classNames('w-6 h-6', className)} />
}
