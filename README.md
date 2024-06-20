# Safidea Engine - Web App Generator

Safidea Engine is a API to generate web app, fast and easy. With a configuration file, you can create a full stack application.

## Getting Started

### Pre-requisites

You should have Node.js 20.11.1 or higher installed on your machine.

### Installation

In a node project, install the engine with npm:

```
npm install @safidea_/engine
```

### Usage

Then, create a startup file, for example `index.js`:

```js
import App from '@safidea_/engine'

const app = new App()
const url = await app.start({
  name: 'Hello world website',
  features: [
    {
      name: 'website',
      pages: [
        {
          name: 'home',
          path: '/',
          body: [
            {
              component: 'Title',
              text: 'Hello world!',
            },
          ],
        },
      ],
    },
  ],
})

console.log(`Server started at ${url}`)
```

Finally, run the startup file with node:

```
node index.js
```

## Configuration

A configuration is a JSON representation of the application. It contains the features, pages, tables, automations, database, etc...

You can see the [full JSON schema documentation here](https://json-schema.app/view/%23?url=https%3A%2F%2Fsafidea.com%2Fschemas%2Fapp.schema.json).

## Templates

You can open our [templates](https://github.com/safidea/templates) to see how to configure the engine and to start from models.

## Contributing

Safidea Engine is built and maintained by a small team – we'd love your help to fix bugs and add features!

You can read our [contributing guide here](https://github.com/safidea/engine/blob/main/docs/CONTRIBUTING.md) and our [code of conduct here](https://github.com/safidea/engine/blob/main/docs/CODE_OF_CONDUCT.md).

## License

Safidea Engine is [BSL 1.1 licensed](https://github.com/safidea/engine/blob/main/LICENSE).
