# Contributing

## Project architecture

This project is split in two folders: `apps` and `packages`

Apps is where applications and there configuration are stored.
Each app as a `config.json` file for app configuration , a `.env` file for app credentials and a `public` folder for static assets.

Packages is where all the app infrastructure is stored. Each configuration type as his own package to manage this feature, as database, table, automation, page, account, etc...

## Packages

### Features

A `foundation-[feature]` package is a package responsible for a specific feature for a specific config. There are independent of each others and can work with the minimum config available.

Here is the current packages list:

- `foundation-database`: Configuration of databases
- `foundation-table`: Configuration of tables and their fields, permissions and database used
- `foundation-realtime`: Configuration of realtime data with tables, fields, permissions and database used
- `foundation-account`: Configuration of accounts groups, the auth methods, roles and database used
- `foundation-action`: Configuration of actions, source code, input/output, tests and permissions
- `foundation-automation`: Configuration of automations and their actions, tests and permissions
- `foundation-integration`: Configuration of integrations, packages to import and source code
- `foundation-component`: Configuration of components with theming
- `foundation-interface`: Configuration of interfaces, with their component, table, storage, action or automation
- `foundation-page`: Configuration of pages with interfaces, permissions and languages
- `foundation-theme`: Configuration of theming
- `foundation-language`: Configuration of languages
- `foundation-storage`: Configuration of storages with permissions

### Core

A `foundation-app` package is the final application using the features that have been configured. It is based on Next.js that has the role of building and running the app.
All Next.js libraries are used here.

### Common

A `server-common` package is a package where shared code between package is stored. This package is responsible for the configuration management between features.

## Architecture

### Features

Each feature package as the same architecture.

```
package-[feature]/
  js/
    server/
    client/
  src/
    server/
      configs/
        [feature].config.ts
      routes/
        [feature].route.ts
      controllers/
        [feature].controller.ts
      services/
        [feature].service.ts
      middlewares/
        [feature].middleware.ts
      lib/
        [name].lib.ts
      utils/
        [name].utils.ts
      index.ts
    client/
      components/
        [name].component.ts
      helpers/
        [feature].helper.ts
      lib/
        [name].lib.ts
      index.ts
    shared/
      components/
        [name].component.ts
      helpers/
        [feature].helper.ts
      lib/
        [name].lib.ts
      interfaces/
        [feature].interface.ts
      types/
        [feature].type.ts
      utils/
        [feature].utils.ts
      index.ts
  tests/
    server/
      unit/
        [feature].route.test.ts
      functional/
        [use-case].test.ts
      jest.config.js
    client/
      unit/
        [feature].component.test.ts
      functional/
        [use-case].test.ts
      jest.config.js
    shared/
      unit/
        [feature].component.test.ts
      functional/
        [use-case].test.ts

```

Here are the imports of each feature package

1. Initialization

`/configs/[feature].config.ts` should be run at first and is doing multiple things :

- Enrichment of the configuration with default values
- Validation of the configuration
- Configuration of libraries used
- Building of JS code used

2. Server import

- `/src/server` export the handler to catch routes calls and access to services in a secure way, with workflow `routes > middlewares > controllers > services > libraries / settings`
- `/src/shared` export components that are client and server side, with workflow `components > helpers > libraries / settings`, in addition to interfaces

3. Client import

- `/src/client` export components that are client side only, with workflow `components > helpers > libraries / settings`
- `/src/shared` export components that are client and server side, with workflow `components > helpers > libraries / settings`, in addition to interfaces

### Common

Here is the structure of the common package

```
src/
  server/
    utils/
      [name].utils.ts
    lib/
      [name].lib.ts
    settings/
      [name].settings.ts
    index.ts
  client/
    utils/
      [name].utils.ts
    lib/
      [name].lib.ts
    settings/
      [name].settings.ts
    index.ts
  shared/
    utils/
      [name].utils.ts
    lib/
      [name].lib.ts
    settings/
      [name].settings.ts
    interfaces/
      [name].interface.ts
    index.ts
tests/
  server/
    unit/
      [feature].route.test.ts
    functional/
      [use-case].test.ts
    jest.config.js
  client/
    unit/
      [feature].component.test.ts
    functional/
      [use-case].test.ts
    jest.config.js
  shared/
    unit/
      [feature].component.test.ts
    functional/
      [use-case].test.ts
```

### Core

Here is the structure of the core package

```
e2e/
  [use-case].test.ts
src/
  server/
    utils/
      [name].utils.ts
    lib/
      [name].lib.ts
    settings/
      [name].settings.ts
  client/
    utils/
      [name].utils.ts
    lib/
      [name].lib.ts
    settings/
      [name].settings.ts
  pages/
    api/
      auth/
        [...nextauth].ts
      table/
        [table].ts
        [table]/
          [id].ts
      action/
        [action].ts
        [action]/
          [id].ts
      automation/
        [automation].ts
        [automation]/
          [id].ts
      storage/
        [storage].ts
        [storage]/
          [id].ts
      realtime.ts
    [[...page]].tsx
    _app.tsx
    _document.tsx
    404.ts
    500.ts
public/
styles/
  globals.css
```

## Configuration

Each feature package has his own config schema.
