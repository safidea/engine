import React from 'react'
import { ContainerUI } from '@entities/app/page/component/container/ContainerComponentUI'

const ContainerTailwindUI: ContainerUI = {
  Container: ({ children, testId }) => {
    return (
      <div className="container mx-auto" data-testid={testId}>
        {children}
      </div>
    )
  },
  Section: ({ children, testId }) => {
    return (
      <section className="py-8" data-testid={testId}>
        {children}
      </section>
    )
  },
}

export default ContainerTailwindUI
