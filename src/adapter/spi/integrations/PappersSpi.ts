import type { PappersEntreprise, IPappersSpi, PappersConfig } from '@domain/integrations/Pappers'

export interface IPappersIntegration {
  getConfig: () => PappersConfig
  getCompany: (siret: string) => Promise<PappersEntreprise | undefined>
}

export class PappersSpi implements IPappersSpi {
  constructor(private _integration: IPappersIntegration) {}

  getConfig = () => {
    return this._integration.getConfig()
  }

  getCompany = async (siret: string) => {
    return this._integration.getCompany(siret)
  }
}
