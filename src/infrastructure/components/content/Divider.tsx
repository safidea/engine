import type { Props } from '@domain/entities/Component'
import { classNames } from '../utils'

export const Divider = ({ id, className = '' }: Props['Divider']) => {
  return (
    <hr
      id={id}
      className={classNames('w-full border-gray-300 dark:border-white" my-4', className)}
    />
  )
}
