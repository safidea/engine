import { UIProps } from '@domain/gateways/IUIGateway'

const TitleUI = {
  xs: ({ children }: UIProps) => <h5>{children}</h5>,
  sm: ({ children }: UIProps) => <h4>{children}</h4>,
  md: ({ children }: UIProps) => <h3>{children}</h3>,
  lg: ({ children }: UIProps) => <h2>{children}</h2>,
  xl: ({ children }: UIProps) => <h1>{children}</h1>,
}

export default TitleUI
