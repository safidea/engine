import type { Props } from '@domain/entities/Component'
import { Container } from '../layout/Container'

export const Features = ({ id, className = '', Title, Paragraph, Features }: Props['Features']) => (
  <Container id={id} className={className} data-component="Features">
    <div className="max-w-screen-md lg:mb-16">
      <Title />
      <Paragraph size="lg" />
    </div>
    <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
      {Features.map((Feature, index) => {
        return (
          <div key={index}>
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
              <Feature.Icon />
            </div>
            <Feature.Title className="mb-2" size="xs" />
            <Feature.Paragraph />
          </div>
        )
      })}
    </div>
  </Container>
)
