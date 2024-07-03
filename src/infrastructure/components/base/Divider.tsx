import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Divider = ({ id, className = '' }: Props['Divider']) => {
  return (
    <div
      id={id}
      className={classNames('w-full border-t border-gray-300 my-4', className)}
      data-component="Divider"
    ></div>
  )
}
