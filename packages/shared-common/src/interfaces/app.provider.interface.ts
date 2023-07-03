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
  buildComponents: (names: { clients: string[]; servers: string[] }) => Promise<void>
}

export interface AppProviderConstructorInterface {
  new ({ path }: { path: string }): AppProviderInterface
}

export type AppProviderComponentsInterface = Record<string, React.FC<any>>
