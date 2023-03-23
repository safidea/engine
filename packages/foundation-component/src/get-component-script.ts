import * as Headlessui from '@headlessui/react'
import * as Heroicons24Outline from '@heroicons/react/24/outline'
import * as Heroicons20Solid from '@heroicons/react/24/outline'

import { capitalize } from 'utils'
import type { UI, ComponentUI } from '../types/component.type'

const componentsImport: { [key: string]: string } = {
  Link: "import Link from 'next/link'",
  Image: "import Image from 'next/image'",
  Fragment: "import { Fragment } from 'react'",
  ...Object.keys(Heroicons24Outline).reduce((acc: { [key: string]: string }, icon: string) => {
    acc[icon as keyof typeof acc] = `import { ${icon} } from '@heroicons/react/24/outline'`
    return acc
  }, {}),
  ...Object.keys(Heroicons20Solid).reduce((acc: { [key: string]: string }, icon: string) => {
    acc[icon as keyof typeof acc] = `import { ${icon} } from '@heroicons/react/20/solid'`
    return acc
  }, {}),
  ...Object.keys(Headlessui).reduce((acc: { [key: string]: string }, component: string) => {
    acc[component as keyof typeof acc] = `import { ${component} } from '@headlessui/react'`
    return acc
  }, {}),
}

function getComponentJSX({
  ui = {},
  tsx = '',
  imports = [],
  types = [],
}: {
  ui?: UI
  tsx?: string
  imports?: string[]
  types?: string[]
}): {
  tsx: string
  imports: string[]
} {
  const { tag, children, ...props }: UI = ui

  let tsxChildren = ''
  if (children != null && Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      if (typeof children[i] === 'string') {
        const child = children[i] as string
        tsxChildren += child
      } else {
        const child = children[i] as UI
        const build = getComponentJSX({ ui: child, tsx, imports, types })
        tsxChildren += build.tsx
        imports = build.imports
      }
    }
  }

  let tsxTag = tag.toString()
  switch (tsxTag) {
    case 'img':
      tsxTag = 'Image'
      props.width = props.width || '50'
      props.height = props.height || '50'
      break
    case 'a':
      tsxTag = 'Link'
      props.href = props.href || '#'
    default:
      if (types.includes(tsxTag)) {
        imports.push(`import ${capitalize(tsxTag)} from './${capitalize(tsxTag)}'\n`)
      }
      break
  }

  const [rootTag] = typeof tsxTag === 'string' ? tsxTag.split('.') : []
  if (componentsImport.hasOwnProperty(rootTag) && !imports.find((i) => i.search(rootTag) > -1)) {
    imports.push(componentsImport[rootTag])
  }

  const tsxProps = Object.keys(props)
    .reduce((acc: string[], prop: string) => {
      const value = props[prop as keyof typeof props]?.toString()
      switch (prop) {
        case 'class':
          prop = 'className'
          break
        case 'as':
          if (value.search('Fragment') > -1 && !imports.find((i) => i.search('Fragment') > -1)) {
            imports.push(componentsImport['Fragment'])
          }
          break
        default:
          break
      }
      if (typeof value === 'boolean' || value === 'true' || value === 'false') {
        acc.push(`${prop}={${value}}`)
        return acc
      }
      acc.push(`${prop}="${value}"`.replace('"{', '{').replace('}"', '}'))
      return acc
    }, [])
    .join(' ')

  tsx +=
    tsxChildren != ''
      ? `<${tsxTag} ${tsxProps}>\n${tsxChildren}\n</${tsxTag}>`
      : `<${tsxTag} ${tsxProps} />`

  return { tsx, imports }
}

export default function getComponentScript(component: ComponentUI, types: string[] = []): string {
  const { name, props, state, ui } = component
  const componentName = capitalize(name)

  const { tsx, imports } = getComponentJSX({ ui, types })

  const inlineProps = props && props.length > 0 ? `const { ${props.join(', ')} } = props` : ''

  const loadComponent = /load\(/g.test(JSON.stringify(ui))
    ? `const load = (id: string) => {
          const component = components.find((c) => c.id === id)
          if (!component) return null
          const DynamicComponent = Components[component.type]
          return <DynamicComponent {...component} />
      }`
    : ''

  const componentProps = [inlineProps ? 'props' : '', loadComponent ? 'components' : '']
    .filter(Boolean)
    .join(', ')

  const classNames = /classNames\(/g.test(JSON.stringify(ui))
    ? "function classNames(...classes) { return classes.filter(Boolean).join(' ')}"
    : ''

  const states = state
    ? Object.keys(state)
        .map((stateKey) => {
          const stateValue = state[stateKey]
          return `const [${stateKey}, set${capitalize(stateKey)}] = useState(${stateValue})`
        })
        .join('\n')
    : ''

  const translate = /t\([\\"\'\`\$\{\}a-zA-Z0-9\.\-:]+\)/g.test(JSON.stringify(ui))
    ? `const { t } = useTranslation()`
    : ''

  if (loadComponent !== '') imports.push("import Components from './index'")

  return `// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

${states !== '' ? "import { useState } from 'react'" : ''}
${translate !== '' ? "import { useTranslation } from 'next-i18next'" : ''}
${imports.join('\n')}
${componentProps !== '' ? "import type { Component } from 'foundation-page'" : ''}
${classNames}
    
export default function ${componentName}(${
    componentProps !== '' ? `{ ${componentProps} }: Component` : ''
  }) {
  ${inlineProps}
  ${states}
  ${translate}
  ${loadComponent}
  
  return (${tsx})
}`
}
