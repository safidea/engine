import type { Props } from '@domain/engine/page/component'
import { classNames, getMarginBottomClasses, getRoundedClasses } from '../utils'
import type { Align, Size } from '@domain/engine/page/component/base/base'

export const Image = ({
  src,
  alt,
  size = 'md',
  rounded,
  align = 'left',
  className = '',
}: Props['Image']) => {
  return (
    <div className={classNames('flex', getImageAlignClasses(align))}>
      <img
        className={classNames(
          'col-span-2 object-contain',
          getImageSizeClasses(size),
          getMarginBottomClasses(size, className),
          rounded ? getRoundedClasses(rounded) : '',
          className
        )}
        src={src}
        alt={alt}
      />
    </div>
  )
}

function getImageAlignClasses(align: Align) {
  switch (align) {
    case 'left':
      return 'justify-start'
    case 'center':
      return 'justify-center'
    case 'right':
      return 'justify-end'
  }
}

function getImageSizeClasses(size: Size) {
  switch (size) {
    case 'xs':
      return 'h-12'
    case 'sm':
      return 'h-24'
    case 'md':
      return 'h-36'
    case 'lg':
      return 'h-48'
    case 'xl':
      return 'h-72'
    case '2xl':
      return 'h-96'
  }
}
