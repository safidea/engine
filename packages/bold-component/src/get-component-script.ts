import * as Headlessui from '@headlessui/react'
import * as Heroicons from '@heroicons/react/24/outline'

import { capitalize } from 'utils'
import type { UI, ComponentUI } from '../types/component.type'

const componentsImport: { [key: string]: string } = {
  Link: "import Link from 'next/link'",
  Image: "import Image from 'next/image'",
  ...Object.keys(Heroicons).reduce((acc: { [key: string]: string }, icon: string) => {
    acc[icon as keyof typeof acc] = `import { ${icon} } from '@heroicons/react/24/outline'`
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
  imports = '',
}: {
  ui?: UI
  tsx?: string
  imports?: string
}): {
  tsx: string
  imports: string
} {
  const { tag, children, ...props }: UI = ui

  let tsxChildren = ''
  if (children != null) {
    for (let i = 0; i < children.length; i++) {
      if (typeof children[i] === 'string') {
        const child = children[i] as string
        tsxChildren += child
      } else {
        const child = children[i] as UI
        const build = getComponentJSX({ ui: child, tsx, imports })
        tsxChildren += build.tsx
        imports = build.imports
      }
    }
  }

  const tsxProps = Object.keys(props)
    .reduce((acc: string[], prop: string) => {
      const value = props[prop as keyof typeof props]?.toString()
      if (prop === 'class') prop = 'className'
      acc.push(`${prop}="${value}"`.replace('"{', '{').replace('}"', '}'))
      return acc
    }, [])
    .join(' ')

  let tsxTag = tag
  switch (tag) {
    case 'img':
      tsxTag = 'Image'
      break
    case 'a':
      tsxTag = 'Link'
    default:
      break
  }

  tsx +=
    tsxChildren != ''
      ? `<${tsxTag} ${tsxProps}>\n${tsxChildren}\n</${tsxTag}>`
      : `<${tsxTag} ${tsxProps} />`

  const [rootTag] = typeof tsxTag === 'string' ? tsxTag.split('.') : []
  if (componentsImport.hasOwnProperty(rootTag) && imports.search(rootTag) === -1) {
    imports += componentsImport[rootTag] + '\n'
  }
  return { tsx, imports }
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

  const { tsx, imports } = getComponentJSX({ ui })
  return `import React from 'react'
${states !== '' ? "import { useState } from 'react'" : ''}
${imports}

${inlineProps !== '' ? "import type { ComponentUI } from 'bold-component'" : ''}
    
export default function ${componentName}(${inlineProps !== '' ? 'props: ComponentUI' : ''}) {
  ${inlineProps}
  ${states}

  return (${tsx})
}`
}
