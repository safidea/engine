import React from 'react'
import { CardUI } from '@entities/app/page/component/card/CardComponentUI'

const CardTailwindUI: CardUI = {
  Card: ({ children }) => (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="p-4">{children}</div>
    </div>
  ),
}

export default CardTailwindUI
