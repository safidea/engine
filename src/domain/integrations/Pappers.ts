export interface PappersConfig {
  apiKey: string
}

export interface IPappersSpi {
  config: () => string
  getCompany: (siret: string) => Promise<PappersEntreprise | undefined>
}

export class Pappers {
  constructor(private _spi: IPappersSpi) {}

  config = () => {
    return this._spi.config()
  }

  getCompany = async (siret: string) => {
    return this._spi.getCompany(siret)
  }
}

export interface PappersEntreprise {
  siren: string
  siren_formate: string
  opposition_utilisation_commerciale: boolean
  nom_entreprise: string
  personne_morale: boolean
  denomination: string
  nom: string | null
  prenom: string | null
  sexe: string | null
  code_naf: string
  libelle_code_naf: string
  domaine_activite: string
  conventions_collectives: PappersConventionCollective[]
  date_creation: string
  date_creation_formate: string
  entreprise_cessee: boolean
  date_cessation: string | null
  entreprise_employeuse: boolean
  societe_a_mission: boolean
  categorie_juridique: string
  forme_juridique: string
  micro_entreprise: boolean
  forme_exercice: string
  effectif: string
  effectif_min: number
  effectif_max: number
  tranche_effectif: string
  annee_effectif: number
  capital: number
  statut_rcs: string
  siege: PappersSiege
  diffusable: boolean
  sigle: string | null
  objet_social: string
  capital_formate: string
  capital_actuel_si_variable: string | null
  devise_capital: string
  numero_rcs: string
  date_cloture_exercice: string | null
  prochaine_date_cloture_exercice: string | null
  economie_sociale_solidaire: boolean
  duree_personne_morale: string | null
  dernier_traitement: string
  derniere_mise_a_jour_sirene: string
  derniere_mise_a_jour_rcs: string
  greffe: string
  code_greffe: string
  date_immatriculation_rcs: string | null
  date_debut_activite: string
  numero_tva_intracommunautaire: string
  validite_tva_intracommunautaire: boolean
  associe_unique: boolean
  etablissements: PappersSiege[]
  finances: PappersFinance[]
  representants: PappersRepresentant[]
  beneficiaires_effectifs: PappersBeneficiaireEffectif[]
  depots_actes: PappersDepotActe[]
  comptes: PappersCompte[]
  publications_bodacc: PappersPublicationBodacc[]
  procedures_collectives: PappersProcedureCollective[]
  procedure_collective_existe: boolean
  procedure_collective_en_cours: boolean
  derniers_statuts: PappersDerniersStatuts
  extrait_immatriculation: PappersExtraitImmatriculation
  rnm: PappersRNM | null
  marques: PappersMarque[]
  association: PappersAssociation | null
  labels: PappersLabel[]
  sites_internet: string[]
  telephone: string | null
  email: string | null
  scoring_non_financier: PappersScoring
  scoring_financier: PappersScoringFinancier
  categorie_entreprise: string
  annee_categorie_entreprise: number
}

interface PappersConventionCollective {
  nom: string
  idcc: number
  confirmee: boolean
  pourcentage: number
}

interface PappersSiege {
  siret: string
  siret_formate: string
  diffusion_partielle: boolean
  nic: string
  code_postal: string
  ville: string
  pays: string
  latitude: number
  longitude: number
  etablissement_cesse: boolean
  siege: boolean
  etablissement_employeur: boolean
  effectif: string
  effectif_min: number
  effectif_max: number
  tranche_effectif: string
  annee_effectif: number
  code_naf: string
  libelle_code_naf: string
  date_de_creation: string
  adresse_ligne_1: string
}

interface PappersFinance {
  annee: number
  chiffre_affaires: number
  resultat: number
}

interface PappersRepresentant {
  qualite: string
  personne_morale: boolean
  denomination: string
}

interface PappersBeneficiaireEffectif {
  nom: string
  pourcentage_parts: number
}

interface PappersDepotActe {
  date_depot: string
  disponible: boolean
}

interface PappersCompte {
  date_depot: string
  date_cloture: string
  disponible: boolean
}

interface PappersPublicationBodacc {
  numero_parution: string
  date: string
  type: string
}

interface PappersProcedureCollective {
  type: string
  date_debut: string
}

interface PappersDerniersStatuts {
  date_depot: string
  disponible: boolean
}

interface PappersExtraitImmatriculation {
  token: string
}

interface PappersRNM {
  date_immatriculation: string
}

interface PappersMarque {
  numero: string
  date_enregistrement: string
}

interface PappersAssociation {
  id_association: string
  denomination: string
}

interface PappersLabel {
  nom: string
}

interface PappersScoring {
  note: string
  score: number
}

interface PappersScoringFinancier extends PappersScoring {
  details_score: PappersDetailsScore
}

interface PappersDetailsScore {
  score_ebit_ca: number
}
