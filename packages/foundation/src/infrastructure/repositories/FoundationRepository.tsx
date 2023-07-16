import { IFoundationRepository } from '@domain/repositories/IFoundationRepository'
import { ReactElement } from 'react'

const App = ({ path }: { path: string }) => (
  <div>
    <h1>Hello World !!!</h1>
    <p>path: {path}</p>
  </div>
)

export class FoundationRepository implements IFoundationRepository {
  public async page(path: string): Promise<ReactElement> {
    return <App path={path} />
  }

  public async route(): Promise<any> {
    return { message: 'Hello World !!!' }
  }
}
