import type { Props } from '@infrastructure/engine'

export const Link = ({ label, href }: Props['Link']) => <a href={href}>{label}</a>
