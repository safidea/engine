import dynamic from 'next/dynamic'

import type { Layout as LayoutProps, Component } from 'bold-page'

export default function Layout({
  components,
  hasContainer,
  fontsVariables,
  namespaces,
}: LayoutProps) {
  return (
    <div
      className={[hasContainer ? 'container' : '', ...(fontsVariables ?? []), 'font-primary'].join(
        ' '
      )}
    >
      {components?.map(({ type, id, props }: Component) => {
        const DynamicComponent = dynamic(() => import('../config/components/' + type), {
          loading: () => <>Loading...</>,
        }) as React.FunctionComponent<Component>
        if (!DynamicComponent) throw new Error(`No component found for type "${type}"`)
        return (
          <DynamicComponent
            key={id}
            id={id}
            type={type}
            props={props}
            namespaces={namespaces ?? []}
          />
        )
      })}
    </div>
  )
}
