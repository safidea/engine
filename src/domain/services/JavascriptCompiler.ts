import { JavascriptRunner } from './JavascriptRunner'
import type {
  Spi as JavascriptRunnerSpi,
  Entities as JavascriptRunnerEntities,
} from './JavascriptRunner'

export type Entities = JavascriptRunnerEntities

export interface Spi {
  compile: (code: string) => JavascriptRunnerSpi
}

export class JavascriptCompiler {
  constructor(
    private _spi: Spi,
    private _entities: Entities
  ) {}

  compile = (code: string): JavascriptRunner => {
    const codeRunner = this._spi.compile(code)
    return new JavascriptRunner(codeRunner, this._entities)
  }
}
