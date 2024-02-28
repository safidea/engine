import type { Props } from '@infrastructure/engine'

export const Image = ({ src, alt }: Props['Image']) => {
  return (
    <img
      className="col-span-2 max-h-32 w-full object-contain opacity-75 grayscale"
      src={src}
      alt={alt}
    />
  )
}
