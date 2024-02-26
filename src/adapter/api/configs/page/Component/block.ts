import type { Component } from '.'

export interface Block extends Partial<Omit<Component, 'component'>> {
  block: string
}
