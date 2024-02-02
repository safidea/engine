import type { ComponentDto } from '../dtos/ComponentDto'
import { Hero } from '@domain/entities/Component/marketing/Hero'
import { Footer } from '@domain/entities/Component/marketing/Footer'
import type { Component, ReactComponents } from '@domain/entities/Component'
import { Paragraph } from '@domain/entities/Component/Paragraph'
import { Form } from '@domain/entities/Component/application/Form'
import { Button } from '@domain/entities/Component/Button'
import { Cta } from '@domain/entities/Component/marketing/Cta'
import { Features } from '@domain/entities/Component/marketing/Features'
import { Logos } from '@domain/entities/Component/marketing/Logos'

export class ComponentMapper {
  static toEntity(dto: ComponentDto, components: ReactComponents): Component {
    switch (dto.component) {
      case 'Hero':
        return new Hero(dto, { component: components.Hero })
      case 'Footer':
        return new Footer(dto, { component: components.Footer })
      case 'Form':
        return new Form(dto, { component: components.Form })
      case 'Paragraph':
        return new Paragraph(dto, { component: components.Paragraph })
      case 'Button':
        return new Button(dto, { component: components.Button })
      case 'CTA':
        return new Cta(dto, { component: components.Cta })
      case 'Features':
        return new Features(dto, { component: components.Features })
      case 'Logos':
        return new Logos(dto, { component: components.Logos })
    }
  }

  static toManyEntities(dtos: ComponentDto[], components: ReactComponents): Component[] {
    return dtos.map((dto) => this.toEntity(dto, components))
  }
}
