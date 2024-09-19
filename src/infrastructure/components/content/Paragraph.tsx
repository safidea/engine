import type { Props } from '@domain/entities/Component'
import {
  classNames,
  getFontClasses,
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
  font,
}: Props['Paragraph']) => {
  return (
    <p
      id={id}
      className={classNames(
        'font-light text-gray-500 dark:text-gray-400',
        getFontClasses(font),
        getTextSizeClasses(size),
        getMarginBottomClasses(size, className),
        getTextAlignClasses(align),
        className
      )}
    >
      {children ?? text}
    </p>
  )
}
