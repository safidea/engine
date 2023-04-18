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
- `foundation-component`: Configuration of components with theming
- `foundation-interface`: Configuration of interfaces, with their component, table, storage, action or automation
- `foundation-page`: Configuration of pages with interfaces, permissions and languages
- `foundation-theme`: Configuration of theming
- `foundation-language`: Configuration of languages
- `foundation-storage`: Configuration of storages with permissions

### Core

A `foundation-core` package is the final application using the features that have been configured. It is based on Next.js that has the role of building and running the app.

### Common

A `foundation-common` package is a package where shared code between package is stored. This package is responsible for the configuration management between features.

## Architecture

### Features

Each feature package as the same architecture.

```
package-[feature]/
  tests/
    server/
    client/
  js/
  scripts/
    config.ts
  src/
    server/
      routes/
        [feature].route.ts
      controllers/
        [feature].controller.ts
      services/
        [feature].service.ts
      middlewares/
        [feature].middleware.ts
      libraries/
        [name].library.ts
      index.ts
    client/
      components/
        [feature].component.ts
      services/
        [feature].service.ts
      libraries/
        [name].library.ts
      index.ts
    shared/
      components/
        [feature].component.ts
      services/
        [feature].service.ts
      libraries/
        [name].library.ts
      interfaces/
        [feature].interface.ts
      settings/
        [feature].setting.ts
      index.ts
```

Here are the imports of each feature package

1. Initialization 
- `/scripts/config.ts` build all the necessary code from config in the `/js`

2. Server import
- `/src/server` export the handler to catch routes calls and access to services in a secure way, with workflow `routes > middlewares > controllers > services > infrastructures / settings`
- `/src/shared` export components that are client and server side, with workflow `components > services > infrastructures`, in addition to interfaces and settings

3. Client import
- `/src/client` export components that are client side only, with workflow `components > services > infrastructures`
- `/src/shared` export components that are client and server side, with workflow `components > services > infrastructures`, in addition to interfaces and settings

### Common

Here is the structure of the common package


### Core

Here is the structure of the core package


## Routes

### App

- `/[...page]`: path to any page
- `/auth/login`: path to login page
- `/auth/register`: path to register page
- `/auth/forgot-password`: path to reset password

### Api
- `/api/auth/getAccessToken`: account API
- `/api/table/[table]/[id?]`: table API
- `/api/action/[action]/[id?]`: action API
- `/api/automation/[automation]/[id?]`: automation API
- `/api/storage/[storage]/[id?]`: storage API
