import type { Props } from '@infrastructure/engine'

export const Link = ({ text, href }: Props['Link']) => <a href={href}>{text}</a>
