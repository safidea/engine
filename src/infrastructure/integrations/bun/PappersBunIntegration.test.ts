import { describe, it, expect } from 'bun:test'
import { PappersBunIntegration } from './PappersBunIntegration'
import { testPappersIntegration } from '@test/integration/pappers.shared'
import type { PappersEntreprise } from '@domain/integrations/Pappers'

const integration = new PappersBunIntegration({
  apiKey: 'test',
})

const sampleCompany: PappersEntreprise = {
  siren: '44306184100047',
  siren_formate: '123 456 789',
  opposition_utilisation_commerciale: false,
  nom_entreprise: 'Example Corp',
  personne_morale: true,
  denomination: 'GOOGLE FRANCE',
  nom: null,
  prenom: null,
  sexe: null,
  code_naf: '6201Z',
  libelle_code_naf: 'Programming activities',
  domaine_activite: 'Technology',
  conventions_collectives: [],
  date_creation: '2022-01-01',
  date_creation_formate: '01/01/2022',
  entreprise_cessee: false,
  date_cessation: null,
  entreprise_employeuse: true,
  societe_a_mission: false,
  categorie_juridique: 'SARL',
  forme_juridique: 'Société à responsabilité limitée',
  micro_entreprise: false,
  forme_exercice: 'Individual',
  effectif: '10-19',
  effectif_min: 10,
  effectif_max: 19,
  tranche_effectif: '10-19',
  annee_effectif: 2022,
  capital: 10000,
  statut_rcs: 'Active',
  siege: {
    siret: '44306184100047',
    siret_formate: '123 456 789 00010',
    diffusion_partielle: false,
    nic: '00010',
    code_postal: '75000',
    ville: 'Paris',
    pays: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
    etablissement_cesse: false,
    siege: true,
    etablissement_employeur: true,
    effectif: '10-19',
    effectif_min: 10,
    effectif_max: 19,
    tranche_effectif: '10-19',
    annee_effectif: 2022,
    code_naf: '6201Z',
    libelle_code_naf: 'Programming activities',
    date_de_creation: '2022-01-01',
    adresse_ligne_1: '123 Main Street',
  },
  diffusable: true,
  sigle: null,
  objet_social: 'Developing software solutions',
  capital_formate: '10,000 EUR',
  capital_actuel_si_variable: null,
  devise_capital: 'EUR',
  numero_rcs: '123456789',
  date_cloture_exercice: null,
  prochaine_date_cloture_exercice: null,
  economie_sociale_solidaire: false,
  duree_personne_morale: null,
  dernier_traitement: '2023-01-01',
  derniere_mise_a_jour_sirene: '2023-01-01',
  derniere_mise_a_jour_rcs: '2023-01-01',
  greffe: 'Paris',
  code_greffe: '7501',
  date_immatriculation_rcs: null,
  date_debut_activite: '2022-01-01',
  numero_tva_intracommunautaire: 'FR123456789',
  validite_tva_intracommunautaire: true,
  associe_unique: false,
  etablissements: [],
  finances: [],
  representants: [],
  beneficiaires_effectifs: [],
  depots_actes: [],
  comptes: [],
  publications_bodacc: [],
  procedures_collectives: [],
  procedure_collective_existe: false,
  procedure_collective_en_cours: false,
  derniers_statuts: { date_depot: '2022-01-01', disponible: true },
  extrait_immatriculation: { token: 'abc123' },
  rnm: null,
  marques: [],
  association: null,
  labels: [],
  sites_internet: [],
  telephone: null,
  email: null,
  scoring_non_financier: { note: 'A', score: 90 },
  scoring_financier: { note: 'B', score: 75, details_score: { score_ebit_ca: 50 } },
  categorie_entreprise: 'Small',
  annee_categorie_entreprise: 2022,
}

// Add a company
await integration.addCompany(sampleCompany)

testPappersIntegration({ describe, it, expect }, integration)
