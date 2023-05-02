# Foundation

## Packages

### Structures

- server / client / shared
  - ** tests **
  - controllers
  - initializers
  - services
  - routes
  - middlewares
  - constants
  - utils
- types
- generated

### Entities

- foundation-app
  - App
- foundation-automation
  - Automation
  - Action
  - Resource
- foundation-page
  - Page
  - Interface
  - Component
- foundation-account
  - Account
  - Role
  - Permission
- foundation-database
  - Database
  - Table
  - Field
- foundation-common
  - Languages
  - Theme
  - Config
  - Initializer

### Dependencies

- foundation-app
  - foundation-automation
  - foundation-page
  - foundation-account
  - foundation-database
- foundation-automation
  - foundation-common
- foundation-page
  - foundation-common
- foundation-account
  - foundation-common
- foundation-database
  - foundation-common

## Initializer workflow

1. Enrich config with default values
2. Compare config to cache
3. Validate new config
4. Generate code
5. Test generated code
