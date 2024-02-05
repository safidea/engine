import type { Props } from '@infrastructure/engine/App'
import { classNames } from '../utils'

export const Logos = ({ title, logos }: Props['Logos']) => {
  const gridColumn = getGridColumns(logos.length)
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 lg:py-16 mx-auto max-w-screen-xl px-4">
        <h2 className="mb-8 lg:mb-16 text-3xl font-extrabold tracking-tight leading-tight text-center text-gray-900 dark:text-white md:text-4xl">
          {title}
        </h2>
        <div className={classNames(`mx-auto grid grid-cols-2 gap-8 sm:gap-12`, gridColumn)}>
          {logos.map((logo, index) => (
            <div key={index} className="flex justify-center items-center">
              <img
                className="col-span-2 max-h-32 w-full object-contain opacity-75 grayscale"
                src={logo.src}
                alt={logo.alt}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function getGridColumns(number: number) {
  switch (number) {
    case 1:
      return 'grid-cols-1'
    case 2:
      return 'grid-cols-2 md:grid-cols-2'
    case 3:
      return 'grid-cols-2 md:grid-cols-3'
    case 4:
      return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    case 5:
      return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
    default:
      return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  }
}
