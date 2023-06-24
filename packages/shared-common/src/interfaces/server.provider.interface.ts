export interface ServerProviderInterface {
  buildPages: () => Promise<void>
}

export interface ServerProviderConstructorInterface {
  new ({ path }: { path: string }): ServerProviderInterface
}

export interface ServerProviderComponentsInterface {
  Image: React.FC<any>
  Link: React.FC<any>
}
