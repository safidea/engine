import { IComponentsRepository } from '@domain/repositories/IComponentsRepository'
import { default as Html } from './Html'

export class Components implements IComponentsRepository {
  get(name: string) {
    switch (name) {
      default:
        return Html
    }
  }
}

export const components = new Components()
