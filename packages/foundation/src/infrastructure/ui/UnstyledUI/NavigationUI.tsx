import { UIProps } from '@domain/repositories/IUIRepository'

const NavigationUI = {
  container: ({ children, ...props }: UIProps) => {
    return <div {...props}>{children}</div>
  },
  sidebar: ({ children, ...props }: UIProps) => {
    return <nav {...props}>{children}</nav>
  },
  links: ({ children, ...props }: UIProps) => {
    return <ul {...props}>{children}</ul>
  },
  content: ({ children, ...props }: UIProps) => {
    return <div {...props}>{children}</div>
  },
}

export default NavigationUI
