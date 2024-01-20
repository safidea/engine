# Solumy Engine

## ROADMAP

- [x] Write all the Request config in yaml, in the simplest format, with the minimum of features
  - [x] Landing page (Webflow alternative)
  - [x] Contact form (Typeform alternative)
- [x] Write the json schema of the engine from typescript interfaces
- [x] Write the config validator from the json schema
- [ ] Write a tests runner for this config (as a standalone tool / package)
- [ ] Develop the new engine by TDD

**Notes:**

17/01

- Les tests doivent pouvoir s'effectuer sur les pages et les automatisation uniquement, indépendamment des composants ou des actions utilisées
- Le CSS n'est pas à notre charge, cela dépendra des composants utilisés et sera chargé dans le fichier index.html configuré
- Un fichier index.html peut être configuré si il nécessite des scripts ou des styles spécifiques

18/01

- Les actions et les composants sont des drivers qui sont développés avec du code
- On rédige dans les automatisations les tests qui vont permettre de vérifier si celle-ci fonctionnent correctement
- Les actions et les composants doivent correspondre à l'interface de la configuration lors de l'initiation de l'app
- La rédaction de la configuration est équivalent à la rédaction de tests qui permettent de vérifier si les drivers fonctionnent correctement tout en exprimant les besoins métiers

- On rédige les tests pour les actions et les composants dans la configuration, ainsi il n'est plus nécessaire d'avoir de tests E2E, il n'y a que les développements extérieurs qui doivent correspondre à la configuration
