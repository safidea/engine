export interface AppProviderPageInterface {
  path: string
}

export interface AppProviderRouteInterface {
  path: string
  methods: string[]
}

export interface AppProviderInterface {
  writeServerFile: (withOrm?: boolean) => Promise<void>
  writeClientFile: () => Promise<void>
  buildPages: (pages: AppProviderPageInterface[]) => Promise<void>
  buildRoutes: (routes: AppProviderRouteInterface[]) => Promise<void>
}

export interface AppProviderConstructorInterface {
  new ({ path }: { path: string }): AppProviderInterface
}

export interface AppProviderComponentsInterface {
  Image: React.FC<any>
  Link: React.FC<any>
}
