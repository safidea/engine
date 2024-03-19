import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Logos = ({ Title, Paragraph, Images }: Props['Logos']) => {
  const gridColumn = getGridColumns(Images.length)
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 lg:py-16 mx-auto max-w-screen-xl px-4">
        {Title ? <Title center={true} className={Paragraph ? 'mb-4' : 'mb-8'} /> : null}
        {Paragraph ? <Paragraph center={true} className="mb-8" /> : null}
        <div className={classNames(`mx-auto grid grid-cols-2 gap-8 sm:gap-12`, gridColumn)}>
          {Images.map((Image, index) => (
            <div key={index} className="flex justify-center items-center">
              <Image />
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
