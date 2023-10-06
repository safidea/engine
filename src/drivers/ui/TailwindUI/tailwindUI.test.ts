import { describe, test, expect } from 'bun:test'
import { TailwindUI } from './index'
import { getIconDriver } from '@drivers/icon'
import { UIStyle } from '@entities/services/ui/UIStyle'

describe('TailwindUI', () => {
  test('should apply a background color style', async () => {
    // GIVEN
    const style: UIStyle = {
      background: {
        color: 'gray-100',
      },
    }
    const tailwindUI = new TailwindUI(getIconDriver())

    // WHEN
    const className = tailwindUI.applyStyle(style)

    // THEN
    expect(className).toEqual('bg-gray-100')
  })

  test('should apply a items center style', async () => {
    // GIVEN
    const style: UIStyle = {
      items: 'center',
    }
    const tailwindUI = new TailwindUI(getIconDriver())

    // WHEN
    const className = tailwindUI.applyStyle(style)

    // THEN
    expect(className).toEqual('items-center')
  })
})
