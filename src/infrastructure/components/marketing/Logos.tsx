import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'
import { Container } from '../base/Container'

export const Logos = ({ id, className = '', Title, Paragraph, Images }: Props['Logos']) => {
  const gridColumn = getGridColumns(Images.length)
  return (
    <Container id={id} className={className}>
      <div className="mb-8">
        {Title ? <Title align="center" /> : null}
        {Paragraph ? <Paragraph align="center" /> : null}
      </div>
      <div className={classNames(`mx-auto grid grid-cols-2 gap-8 sm:gap-12`, gridColumn)}>
        {Images.map((Image, index) => (
          <div key={index} className="flex justify-center items-center">
            <Image className="opacity-75 grayscale" />
          </div>
        ))}
      </div>
    </Container>
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
