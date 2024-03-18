import type { Props } from '@infrastructure/client/engine'
import { classNames } from '../utils'
import * as heroicons from '@heroicons/react/24/outline'

export const Icon = ({ type, className = '' }: Props['Icon']) => {
  const Icon = heroicons[`${type}Icon`]
  return <Icon className={classNames('w-6 h-6', className)} />
}
