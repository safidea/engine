# Architecture

Safidea Engine is sharing the same codebase for the client and the server written in Typescript and React.

## Project Structure

The codebase is organized following the Clean Architecture principles. In our case, we have 3 layers: Drivers, Adapters and Entities. We do not have a Use Case layer because we do not have any business logic as it's provided by the developer.

```
src
├── adapters                - Adapters layer
│   ├── controllers         - Controllers for each requests
│   ├── dtos                - Data Transfer Objects
│   ├── mappers             - Mappers to convert external data to entities
│   ├── middlewares         - Middlewares for each routes
│   ├── validators          - Validators for each request
├── drivers                 - Drivers layer
│   ├── converter           - Converter driver
│   ├── database            - Database driver
│   ├── logger              - Logger driver
│   ├── server              - Server driver
│   ├── storage             - Storage driver
│   ├── templater           - Templater driver
│   ├── ui                  - UI driver
├── entities                - Entities layer
│   ├── app                 - App used in the adapters
│   │   ├── automation      - Automation entity
│   │   │   ├── action      - Action entity
│   │   │   ├── trigger     - Trigger entity
│   │   ├── bucket          - Bucket entity
│   │   ├── page            - Page entity
│   │   │   ├── component   - Component entity
│   │   ├── table           - Table entity
│   │   │   ├── field       - Field entity
│   ├── services            - Services used in the app entity
│   │   ├── converter       - Converter service
│   │   ├── database        - Database service
│   │   ├── logger          - Logger service
│   │   ├── server          - Server service
│   │   ├── storage         - Storage service
│   │   ├── templater       - Templater service
│   │   ├── ui              - UI service
```
