import type { Props } from '@domain/engine/page/component'
import { Container } from '../base/Container'

export const Cta = ({ id, className = '', Title, Paragraph, Buttons }: Props['Cta']) => (
  <Container id={id} className={className}>
    <div className="max-w-screen-md">
      <Title className="mb-4" />
      <Paragraph className="mb-8" size="xl" />
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        {Buttons.map((Button, index) => (
          <Button key={index} className="inline-flex items-center justify-center" />
        ))}
      </div>
    </div>
  </Container>
)
