import { Components } from '../config'

import type { Component } from 'bold-page'

export default function Layout({ components }: { components: Component[] }) {
  if (components === undefined) throw new Error('No components found in page.')

  return (
    <>
      {components.map(({ type, id, props, components }: Component) => {
        const DynamicComponent = Components[type as keyof typeof Components] as React.FC<Component>
        if (!DynamicComponent) throw new Error(`No component found for type "${type}"`)
        return (
          <DynamicComponent key={id} id={id} type={type} props={props} components={components} />
        )
      })}
    </>
  )
}
