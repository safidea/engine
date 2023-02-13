import { Barlow, Inter } from '@next/font/google'

const primary = Barlow({
  subsets: ['latin'],
  variable: '--font-barlow',
  weight: ['300', '400', '500', '700'],
})

const secondary = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '700'],
})

const fonts = [primary.variable, secondary.variable]

export default fonts
