import React from 'react'
import { ContainerUI } from '@entities/app/page/component/container/ContainerComponentUI'
import { ApplyStyle } from '..'

const ContainerTailwindUI = (applyStyle: ApplyStyle): ContainerUI => ({
  Container: ({ children, testId, style }) => {
    return (
      <div className={applyStyle(style, 'container mx-auto')} data-testid={testId}>
        {children}
      </div>
    )
  },
  Section: ({ children, testId, style }) => {
    return (
      <section className={applyStyle(style, 'py-8')} data-testid={testId}>
        {children}
      </section>
    )
  },
})

export default ContainerTailwindUI
