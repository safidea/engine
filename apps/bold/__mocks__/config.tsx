import { configMock, ComponentUI } from 'bold-config'
import { componentsMock } from 'bold-component'
import { Component } from 'bold-page'

const { locales, theme, apis, tables, pages, ...app } = configMock

function ComponentMock({ id, type }: Component) {
  return <div id={id}>{type}</div>
}

const Components = componentsMock.reduce(
  (acc: { [key: string]: React.FC<Component> }, { name }: ComponentUI) => {
    acc[name as keyof typeof acc] = ComponentMock as React.FC<Component>
    return acc
  },
  {}
)

export { locales, app, theme, apis, tables, pages, Components }
