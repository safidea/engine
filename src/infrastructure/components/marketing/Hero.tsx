import type { Props } from '@domain/entities/Component'
import { Container } from '../layout/Container'

export const Hero = ({ id, className = '', Title, Paragraph, Buttons }: Props['Hero']) => (
  <Container id={id} className={className} center={true} data-component="Hero">
    <Title size="2xl" align="center" />
    <Paragraph size="2xl" align="center" />
    <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
      {Buttons.map((Button, index) => (
        <Button key={index} />
      ))}
    </div>
  </Container>
)
