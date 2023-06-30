export interface AppProviderPageInterface {
  path: string
}

export interface AppProviderRouteInterface {
  path: string
  methods: string[]
}

export interface AppProviderFoundationFileOptions {
  withOrm: boolean
  withComponents: boolean
}

export interface AppProviderInterface {
  writeFoundationFile: (options: AppProviderFoundationFileOptions) => Promise<void>
  buildPages: (pages: AppProviderPageInterface[]) => Promise<void>
  buildRoutes: (routes: AppProviderRouteInterface[]) => Promise<void>
  buildClientComponents: (names: string[]) => Promise<void>
}

export interface AppProviderConstructorInterface {
  new ({ path }: { path: string }): AppProviderInterface
}

export interface AppProviderComponentsInterface {
  Image?: React.FC<any>
  Link?: React.FC<any>
  Form?: React.FC<any>
  List?: React.FC<any>
  Navigation?: React.FC<any>
}
