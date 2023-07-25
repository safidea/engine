import { Page } from '@domain/entities/Page'
import { ReactElement } from 'react'

export class RenderPage {
  constructor() {}

  async execute(page: Page): Promise<ReactElement> {
    const { components } = page
    return (
      <div>
        {components.map((component, index) => (
          <component.render key={index} />
        ))}
      </div>
    )
  }
}
