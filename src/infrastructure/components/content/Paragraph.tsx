import type { Props } from '@domain/engine/page/component'
import {
  classNames,
  getMarginBottomClasses,
  getTextAlignClasses,
  getTextSizeClasses,
} from '../utils'

export const Paragraph = ({
  id,
  text,
  align = 'left',
  size = 'md',
  className = '',
  children,
}: Props['Paragraph']) => {
  return (
    <p
      id={id}
      className={classNames(
        'font-light text-gray-500 dark:text-gray-400',
        getTextSizeClasses(size),
        getMarginBottomClasses(size, className),
        getTextAlignClasses(align),
        className
      )}
      data-component="Paragraph"
    >
      {children ?? text}
    </p>
  )
}
