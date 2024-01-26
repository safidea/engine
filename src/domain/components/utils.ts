import * as Icons from '@heroicons/react/24/solid'

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function getIcon(name: string) {
  //console.log(Icons)
  switch (name) {
    case 'beaker':
      return Icons.BeakerIcon
    default:
      return () => null
  }
}
