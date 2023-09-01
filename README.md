# Foundation

## Objectif Fin Juin > Fonctionnalité de facturation

- [x] Liste des factures
  - [x] Groupe brouillon > pour voir ce qu'il reste à créer
  - [x] Groupe finalisées > pour voir qu'est-ce qu'il y a émettre
  - [x] Groupe émises > pour voir ce qu'y n'a pas encore été payé
  - [x] Groupe réglées > pour voir tout ce qui a été réglé
- [x] Créer / éditer une facture manuellement (Timebox pour 1 facture : 15 minutes max)
  - [x] Formulaire de création d'une facture
    - [x] Coordonnée client
      - [ ] Saisie automatique depuis la liste des clients ⚠ _(lien avec gestion de client)_
    - [x] Numéro de facture
    - [x] Prestation de service à l'heure : nombre d'heure
    - [x] Refacturation optionnelle : libellé + prix
    - [x] => Montant total avec TVA est calculé automatiquement en fonction de : TVA, nombre d'heure, prix unitaire
    - [x] Finaliser la facture :
      - [x] enregistrement de la date de finalisation
      - [x] enregistrement du numéro de facture
      - [x] la facture devient non éditable
      - [x] génération de PDF
      - [x] stockage du PDF
- [x] Émission de la facture vers le client
  - [x] La date d'émission de la facture est sauvegardée dans le système
    - [x] V1 : Bouton manuel d'horodatage
    - [ ] V2 : Envoie et horodatage automatique
- [ ] Savoir à quelle date la facture a été réglée
  - [ ] Saisir la date de paiement
- [ ] Faire un export pour le comptable des factures de l'année pour la date de finalisation de la facture
  - [ ] Mettre à disposition un tableau qui permet d'accéder à chacune des factures (mêmes informations précédentes à afficher)


TODO: Utiliser cette librarie pour tester avec Docker : https://github.com/testcontainers/testcontainers-node


## NEXT STEPS :

- Qui est loggué ? => Délégué 90% du taff sur l'authentification
- Qu'est-ce qu'il a le droit de faire ? => Délégué 5% du taff

=> Quel va être le modèle de permission ? => Délégué 100% du taff
=> Que'est ce qui ce passe si l'employé déplègue des responsabilité ? Part de la boite ? Revient de la boite ?

- Être SOC2 Compliant pour bosser avec les grosses boites

TODO:
- [] Tester avec Passport la connection SSO avec Google Business

### Business

- Plan Community
  - Import our NPM package in your Node app and deploy anywhere you want
  - Basic User Management and Authentication

- Plan Business
  - Everything from Community
  - Granular Rolebased Access Control
  - Pay per employee
  - We help you to run foundation in your infrastructure and connect to your User Directory
  - Private Admin Dashboard to monitor application usage

- Contact US
  - Everything from EE

#### Final User

- Vendre un applicatif de Foundation, pas Foundation directement
- Séparer les templates de Foundation => un repo par template (ex: invoices)
  -  Ajouter dans le repo de l'outil de facturation des tests e2e spécifique à l'outil de facturation
  -  L'outil de facturation n'est qu'un applicatif e2e de Foundation que je vends, avec sa propre landing page

**V1**
- Ce que je vends, c'est le consulting d'installation de l'applicatif de l'application de facturation
- Études de marché sur une verticale particulière pour payer plus cher mais expliquer pourquoi et les avantages
  - Il utilise quoi comme outil ? Comment ? Combien ça coûte ? Quels sont les avantages et les inconvénients ?

Inbound pour le recrutement
Outbound pour la verticale

Choisir de la verticale, et faire aussi de l'inbound dessus

J'ouvre un blog sur le marketing, et je fais des interviews pour répondre à mes questions

Verticale : application de service de coaching
=> Vendre des packs de temps dégraissif (300€ / 1 heure ou 1000€ / 5 heures)