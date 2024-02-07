import type { Icon } from '@domain/entities/page/component/Icon'
import * as heroicons from '@heroicons/react/24/outline'

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function getIcon(name: Icon) {
  return heroicons[`${name}Icon`]
}

export type InputType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week'
