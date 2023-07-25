import { ComponentDto } from '@application/dtos/ComponentDto'
import { Component } from '@domain/entities/Component'
import { Link } from '@domain/entities/components/Link'
import { Paragraph } from '@domain/entities/components/Paragraph'
import { IUIRepository } from '@domain/repositories/IUIRepository'

export function mapDtoToComponent(componentDto: ComponentDto, ui: IUIRepository): Component {
  const { type } = componentDto
  if (type === 'link') {
    return new Link(componentDto.path, componentDto.label, ui.LinkUI)
  }
  if (type === 'paragraph') {
    return new Paragraph(componentDto.text, ui.ParagraphUI)
  }
  throw new Error(`Invalid component type ${type}`)
}
