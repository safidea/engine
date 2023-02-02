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

  let jsxChildren = ''
  if (children != null) {
    for (let i = 0; i < children.length; i++) {
      if (typeof children[i] === 'string') {
        const child = children[i] as string
        jsxChildren += child
      } else {
        const child = children[i] as UI
        const build = getComponentJSX({ ui: child, jsx, imports })
        jsxChildren += build.jsx
        imports = build.imports
      }
    }
  }

  const jsxProps = Object.keys(props)
    .reduce((acc: string[], prop: string) => {
      const value = props[prop as keyof typeof props]?.toString()
      if (prop === 'class') prop = 'className'
      acc.push(`${prop}="${value}"`.replace('"{', '{').replace('}"', '}'))
      return acc
    }, [])
    .join(' ')

  let jsxTag = tag
  switch (tag) {
    case 'img':
      jsxTag = 'Image'
      break
    case 'a':
      jsxTag = 'Link'
    default:
      break
  }

  jsx +=
    jsxChildren != ''
      ? `<${jsxTag} ${jsxProps}>\n${jsxChildren}\n</${jsxTag}>`
      : `<${jsxTag} ${jsxProps} />`

  const [rootTag] = typeof jsxTag === 'string' ? jsxTag.split('.') : []
  if (componentsImport.hasOwnProperty(rootTag) && imports.search(rootTag) === -1) {
    imports += componentsImport[rootTag] + '\n'
  }
  return { jsx, imports }
}

export default function getComponentScript(component: ComponentUI): string {
  const { name, props, state, ui } = component
  const componentName = capitalize(name)

  const states = state
    ? Object.keys(state)
        .map((stateKey) => {
          const stateValue = state[stateKey]
          return `const [${stateKey}, set${capitalize(stateKey)}] = useState(${stateValue})`
        })
        .join('\n')
    : ''

  const inlineProps = props && props.length > 0 ? `const { ${props.join(', ')} } = props` : ''

  const { jsx, imports } = getComponentJSX({ ui })
  return `${states !== '' ? "import { useState } from 'react'" : ''}
${imports}

${inlineProps !== '' ? "import type { ComponentUI } from 'bold-component'" : ''}
    
export default function ${componentName}(${inlineProps !== '' ? 'props: ComponentUI' : ''}) {
  ${inlineProps}
  ${states}

  return (${jsx})
}`
}
