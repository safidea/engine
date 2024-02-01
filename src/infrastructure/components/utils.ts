import * as heroicons from '@heroicons/react/24/outline'

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type IconNames = keyof typeof heroicons
type WithoutIconSuffix<T extends string> = T extends `${infer R}Icon` ? R : never
export type Icon = WithoutIconSuffix<IconNames>

export function getIcon(name: Icon) {
  return heroicons[`${name}Icon`]
}

export type HTMLInputType =
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
