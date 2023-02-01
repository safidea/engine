import { components as library } from 'bold-build'

import type { Layout as LayoutProps, Component } from 'bold-page'

const libraryTyped = library as {
  [key: string]: React.FunctionComponent<Component>
}

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
        const Component = libraryTyped[type as keyof typeof libraryTyped]
        if (!Component) throw new Error(`No component found for type ${type}`)
        return (
          <Component key={id} id={id} type={type} props={props} namespaces={namespaces ?? []} />
        )
      })}
    </div>
  )
}
