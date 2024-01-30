# Solumy Engine

## ROADMAP

- [x] Write all the Request config in yaml, in the simplest format, with the minimum of features
  - [x] Landing page (Webflow alternative)
  - [x] Contact form (Typeform alternative)
- [x] Write the json schema of the engine from typescript interfaces
- [x] Write the config validator from the json schema
- [x] Write the spec tester for a config
- [x] Refactor to fix all TODOs
- [x] Install storybook
- [x] Write the Request Landing Page with TDD (tests for each component)
- [ ] Write the Request Contact Form with TDD (tests for each component)

**Refactor Clean Archi**

- [ ] Replace all drivers in domain by services

**Notes:**

24/01

- Créer un composant form qui intègre directement les inputs

23/01

- Les composants peuvent être personnalisés uniquement si ils contiennent les mêmes props que le composant par défaut, ainsi le comportement reste le même mais le design change

21/01

- L'engine doit proposer une liste de composants et d'action par défaut, tout en laissant la liberté d'en ajouter des nouveaux par le développeur
- L'intégrité des composants et des actions est vérifié par la validation du schema
- Utiliser TailwindComponent au lieu de Tailwind UI pour les composants par défaut
- Les composants doivent être du JSX
- Les tests E2E des features peuvent s'exécuter via une fonction dédiée, on peut decider de lancer l'application avec les tests ou sans
- Les tests peuvent s'exécuter pour toutes les features ou juste pour l'une d'entre elles

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

20/01

- Les tests font partie intégrante de la configuration, ils sont écrits dans la configuration et sont exécutés par le moteur, permettant de valider l'intégrité des composants et des actions
