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
  jsx = '',
  imports = '',
}: {
  ui?: UI
  jsx?: string
  imports?: string
}): {
  jsx: string
  imports: string
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
        const build = getComponentJSX({ ui: child, jsx, imports })
        tsxChildren += build.jsx
        imports = build.imports
      }
    }
  }

  let tsxTag = tag
  switch (tag) {
    case 'img':
      tsxTag = 'Image'
      props.width = props.width || '50'
      props.height = props.height || '50'
      break
    case 'a':
      tsxTag = 'Link'
      props.href = props.href || '#'
    default:
      break
  }

  const tsxProps = Object.keys(props)
    .reduce((acc: string[], prop: string) => {
      const value = props[prop as keyof typeof props]?.toString()
      switch (prop) {
        case 'class':
          prop = 'className'
          break
        case 'as':
          if (value.search('Fragment') > -1 && imports.search('Fragment') === -1) {
            imports += componentsImport['Fragment'] + '\n'
          }
          break
        default:
          break
      }
      if (typeof value === 'boolean') {
        acc.push(`${prop}`)
        return acc
      }        
      acc.push(`${prop}="${value}"`.replace('"{', '{').replace('}"', '}'))
      return acc
    }, [])
    .join(' ')

  jsx +=
    tsxChildren != ''
      ? `<${tsxTag} ${tsxProps}>\n${tsxChildren}\n</${tsxTag}>`
      : `<${tsxTag} ${tsxProps} />`

  const [rootTag] = typeof tsxTag === 'string' ? tsxTag.split('.') : []
  if (componentsImport.hasOwnProperty(rootTag) && imports.search(rootTag) === -1) {
    imports += componentsImport[rootTag] + '\n'
  }
  return { jsx, imports }
}

export default function getComponentScript(component: ComponentUI): string {
  const { name, props, state, ui } = component
  const componentName = capitalize(name)

  const inlineProps = props && props.length > 0 ? `const { ${props.join(', ')} } = props` : ''

  const states = state
    ? Object.keys(state)
        .map((stateKey) => {
          const stateValue = state[stateKey]
          return `const [${stateKey}, set${capitalize(stateKey)}] = useState(${stateValue})`
        })
        .join('\n')
    : ''

  const { jsx, imports } = getComponentJSX({ ui })
  return `// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

${states !== '' ? "import { useState } from 'react'" : ''}
${imports}
${inlineProps !== '' ? "import type { ComponentUI } from 'bold-component'" : ''}
    
export default function ${componentName}(${inlineProps !== '' ? '{ props }: ComponentUI' : ''}) {
  ${inlineProps}
  ${states}

  return (${jsx})
}`
}
