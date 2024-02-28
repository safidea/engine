import type { Props } from '@infrastructure/engine'
import { classNames } from '../utils'

export const Image = ({ src, alt, className = '' }: Props['Image']) => {
  return (
    <img
      className={classNames(
        'col-span-2 max-h-32 w-full object-contain opacity-75 grayscale',
        className
      )}
      src={src}
      alt={alt}
    />
  )
}
