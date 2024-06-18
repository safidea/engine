# Architecture

Safidea Engine is sharing the same codebase for the client and the server written in Typescript and React.

## Project Structure

The codebase is organized following the Clean Architecture principles. In our case, we have 3 layers: adapter, domain and infrastructure. We do not have a use case layer because we do not have any business logic as it's provided by the developer.

```
src
├── adapter
│   ├── api
│   │   ├── config
│   │   │   ├── automation
│   │   │   │   ├── action
│   │   │   │   ├── trigger
│   │   │   ├── page
│   │   │   │   ├── component
│   │   │   │   │   ├── application
│   │   │   │   │   ├── base
│   │   │   │   │   ├── marketing
│   │   │   │   ├── head
│   │   │   ├── table
│   │   │   │   ├── field
│   │   │   ├── spec
│   │   │   │   ├── action
│   │   │   │   ├── result
│   │   │   ├── filter
│   │   ├── mappers
│   │   │   │   ├── automation
│   │   │   │   ├── page
│   │   │   │   ├── spec
│   │   │   │   ├── table
│   │   ├── options
│   ├── spi
│   │   ├── dtos
│   │   ├── mappers
├── domain
│   ├── engine
│   │   ├── automation
│   │   │   ├── action
│   │   │   ├── trigger
│   │   ├── page
│   │   │   ├── component
│   │   │   │   ├── application
│   │   │   │   ├── base
│   │   │   │   ├── marketing
│   │   │   ├── head
│   │   ├── table
│   │   │   ├── field
│   │   ├── spec
│   │   │   ├── action
│   │   │   ├── result
│   ├── entities
│   │   ├── email
│   │   ├── error
│   │   ├── filter
│   │   ├── job
│   │   ├── record
│   │   ├── request
│   │   ├── response
│   ├── services
├── infrastructure
│   ├── client
│   │   ├── controllers
│   ├── components
│   │   │   ├── application
│   │   │   ├── base
│   │   │   ├── marketing
│   ├── drivers

```
