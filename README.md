# Foundation

## Objectif Fin Juin > Fonctionnalité de facturation

- [ ] Liste des factures
  - [ ] Groupe brouillon > pour voir ce qu'il reste à créer
  - [ ] Groupe finalisées > pour voir qu'est-ce qu'il y a émettre
  - [ ] Groupe émises > pour voir ce qu'y n'a pas encore été payé
  - [ ] Groupe réglées > pour voir tout ce qui a été réglé
- [ ] Créer / éditer une facture manuellement (Timebox pour 1 facture : 15 minutes max)
  - [ ] Formulaire de création d'une facture
    - [ ] Coordonnée client
      - [ ] Saisie automatique depuis la liste des clients ⚠ _(lien avec gestion de client)_
    - [ ] Numéro de facture
    - [ ] Prestation de service à l'heure : nombre d'heure
    - [ ] Refacturation optionnelle : libellé + prix
    - [ ] => Montant total avec TVA est calculé automatiquement en fonction de : TVA, nombre d'heure, prix unitaire
    - [ ] Finaliser la facture : enregistrement de la date de facturation + génération de PDF et stockage du PDF + la facture devient non éditable
- [ ] Émission de la facture vers le client
  - [ ] La date d'émission de la facture est sauvegardée dans le système
    - [ ] V1 : Bouton manuel d'horodatage
    - [ ] V2 : Envoie et horodatage automatique
- [ ] Savoir à quelle date la facture a été réglée
  - [ ] Saisir la date de paiement
- [ ] Faire un export pour le comptable des factures de l'année pour la date de finalisation de la facture
  - [ ] Mettre à disposition un tableau qui permet d'accéder à chacune des factures (mêmes informations précédentes à afficher)
