import { ComponentDto } from '@application/dtos/ComponentDto'
import { Component } from '@domain/entities/Component'
import { Link } from '@domain/entities/components/Link'
import { Paragraph } from '@domain/entities/components/Paragraph'

export function mapDtoToComponents(componentDto: ComponentDto): Component {
  const { type } = componentDto
  if (type === 'link') {
    return new Link(componentDto.href, componentDto.text)
  }
  if (type === 'paragraph') {
    return new Paragraph(componentDto.text)
  }
  throw new Error(`Invalid component type ${type}`)
}
