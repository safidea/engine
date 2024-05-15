import { PageApi } from '@adapter/api/PageApi'
import type { ReactComponents } from '@domain/engine/page/component'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export type { Page } from '@adapter/api/configs/page/Page'
export type { Component } from '@adapter/api/configs/page/Component'

export default class extends PageApi {
  constructor(options: { components?: Partial<ReactComponents> } = {}) {
    super({
      drivers,
      components: { ...components, ...options?.components },
    })
  }
}
