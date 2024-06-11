import type { Props } from '@domain/engine/page/component'
import { Container } from '../base/Container'

export const Hero = ({ id, className = '', Title, Paragraph, Buttons }: Props['Hero']) => (
  <Container id={id} className={className} align="center">
    <Title size="2xl" align="center" />
    <Paragraph size="2xl" align="center" />
    <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
      {Buttons.map((Button, index) => (
        <Button key={index} />
      ))}
    </div>
  </Container>
)
