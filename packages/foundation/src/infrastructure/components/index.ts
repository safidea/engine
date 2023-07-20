import { IComponentsRepository } from '@domain/repositories/IComponentsRepository'
import { default as Html } from './Html'

export class Components implements IComponentsRepository {
  get(key: string) {
    switch (key) {
      default:
        return Html
    }
  }
}

export const components = new Components()
