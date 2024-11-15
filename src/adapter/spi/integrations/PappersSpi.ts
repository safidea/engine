import type { PappersEntreprise, IPappersSpi } from '@domain/integrations/Pappers'

export interface IPappersIntegration {
  config: () => string
  getCompany: (siret: string) => Promise<PappersEntreprise | undefined>
}

export class PappersSpi implements IPappersSpi {
  constructor(private _integration: IPappersIntegration) {}

  config = () => {
    return this._integration.config()
  }

  getCompany = async (siret: string) => {
    return this._integration.getCompany(siret)
  }
}
