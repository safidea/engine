# Foundation

## Objectif Fin Juin > Fonctionnalité de facturation

- [x] Liste des factures
  - [x] Groupe brouillon > pour voir ce qu'il reste à créer
  - [x] Groupe finalisées > pour voir qu'est-ce qu'il y a émettre
  - [x] Groupe émises > pour voir ce qu'y n'a pas encore été payé
  - [x] Groupe réglées > pour voir tout ce qui a été réglé
- [ ] Créer / éditer une facture manuellement (Timebox pour 1 facture : 15 minutes max)
  - [x] Formulaire de création d'une facture
    - [x] Coordonnée client
      - [ ] Saisie automatique depuis la liste des clients ⚠ _(lien avec gestion de client)_
    - [ ] Numéro de facture
    - [x] Prestation de service à l'heure : nombre d'heure
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

TODO

- [x] Pouvoir commit en ignorant les tests (avoir un indicateur dans le commit si les tests ne passe pas)
      => skiper le test en question

TODO
Priorité

- [ ] Finaliser les use-cases avec tests pour le formulaire d'édition
      Pas priorité
- [ ] Je dois pouvoir passer dans les tests le router de mon choix
      Typescript:
- [ ] Enlever les suffixes "Interface" sur les types
- [ ] Prendre le temps de clarifier le vocabulaire de l'application en donnant des nom très précis pour chaque type
- [ ] S'assurer qu'il n'y ai aucune ambiguité dans les noms / mots
- [ ] Utiliser JS Docs pour typer le code générer
- [ ] Dès que quand j'importe du JSON externe, je dois valider le type avec un typeguarde (plus tard)
- [ ] Ne pas partir dans des énormes tunnels
