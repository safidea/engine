# Solumy Engine

## ROADMAP

- [x] Write all the Request config in yaml, in the simplest format, with the minimum of features
  - [x] Landing page (Webflow alternative)
  - [x] Contact form (Typeform alternative)
- [ ] Write a tests generator for this config (as a standalone tool / package)
  - [ ] Pages
  - [ ] Automations
- [ ] Develop the new engine by TDD


**Notes:**
- Les tests doivent pouvoir s'effectuer sur les pages et les automatisation uniquement, indépendamment des composants ou des actions utilisées
- Le CSS n'est pas à notre charge, cela dépendra des composants utilisés et sera chargé dans le fichier index.html configuré
- Un fichier index.html peut être configuré si il nécessite des scripts ou des styles spécifiques