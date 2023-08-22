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
    - [ ] Finaliser la facture :
      - [x] enregistrement de la date de finalisation
      - [x] enregistrement du numéro de facture
      - [x] la facture devient non éditable
      - [x] génération de PDF
      - [x] stockage du PDF
- [ ] Émission de la facture vers le client
  - [ ] La date d'émission de la facture est sauvegardée dans le système
    - [ ] V1 : Bouton manuel d'horodatage
    - [ ] V2 : Envoie et horodatage automatique
- [ ] Savoir à quelle date la facture a été réglée
  - [ ] Saisir la date de paiement
- [ ] Faire un export pour le comptable des factures de l'année pour la date de finalisation de la facture
  - [ ] Mettre à disposition un tableau qui permet d'accéder à chacune des factures (mêmes informations précédentes à afficher)
