# Contributing

## Project architecture

This project is split in two folders: `apps` and `packages`

Apps is where applications and there configuration are stored.
Each app as a `config.json` file for app configuration , a `.env` file for app credentials and a `public` folder for static assets.

Packages is where all the app infrastructure is stored. Each configuration type as his own package to manage this feature, as database, table, automation, page, account, etc...

## Configuration

You can find the configuration schema at: `packages/foundation-common/src/shared/interfaces/config.interface.ts`

## Packages

### Features

A `foundation-[feature]` package is a package responsible for a specific feature for a specific config. There are independent of each others and can work with the minimum config available.

Here is the current packages list:
- `foundation-database`: Configuration of databases
- `foundation-table`: Configuration of tables and their fields, permissions and database used
- `foundation-account`: Configuration of accounts groups, the auth methods, roles and database used
- `foundation-action`: Configuration of actions, source code, input/output, tests and permissions
- `foundation-automation`: Configuration of automations and their actions, tests and permissions
- `foundation-integration`: Configuration of integrations, packages to import and source code
- `foundation-component`
- `foundation-interface`
- `foundation-page`
- `foundation-theme`
- `foundation-language`
- `foundation-storage`

### Core

A `foundation-core` package is the final application using the features that have been configured. It is based on Next.js that has the role of building and running the app.

### Common

A `foundation-common` package is a package where shared code between package is stored. This package is responsible for the configuration management between features.

## Architecture

Each package as the same architecture.

```
package/
  tests/
    server/
    client/
  data/
  src/
    server/
      routes/
      controllers/
      services/
      middlewares/
      constants/
      initializers/
      utils/
      infrastructures/
      index.ts
    client/
      components/
      services/
      index.ts
    shared/
      interfaces/
```