import React from 'react'
import { CardUI } from '@entities/app/page/component/card/CardComponentUI'
import { ApplyStyle } from '..'

const CardTailwindUI = (applyStyle: ApplyStyle): CardUI => ({
  Card: ({ children, style }) => (
    <div className={applyStyle(style, 'bg-white shadow sm:rounded-lgp-4')}>{children}</div>
  ),
})

export default CardTailwindUI
