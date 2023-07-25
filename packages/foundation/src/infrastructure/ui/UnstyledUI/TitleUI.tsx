import { UIProps } from '@domain/repositories/IUIRepository'

const TitleUI = {
  xs: ({ children, ...props }: UIProps) => <h5 {...props}>{children}</h5>,
  sm: ({ children, ...props }: UIProps) => <h4 {...props}>{children}</h4>,
  md: ({ children, ...props }: UIProps) => <h3 {...props}>{children}</h3>,
  lg: ({ children, ...props }: UIProps) => <h2 {...props}>{children}</h2>,
  xl: ({ children, ...props }: UIProps) => <h1 {...props}>{children}</h1>,
}

export default TitleUI
