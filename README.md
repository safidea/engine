# Solumy Engine - Internal Tool Generator

Solumy Engine is a framework to create internal tools, fast and easy. With a simple configuration file, you can create a full stack application with a React frontend and a Node.js backend.

## Getting Started

### Pre-requisites

You should have Node.js v18 or higher installed on your machine, or Bun v1.0.0 or higher.

### Installation

In a node project, install the engine with npm:

```
npm install @solumy/engine
```

Or with bun:

```
bun add @solumy/engine
```

### Usage

Then, create a startup file, for example `index.js`:

```js
const { Engine } = require('@solumy/engine')

new Engine().start({
  pages: [
    {
      path: '/',
      title: 'Home',
      components: [
        {
          type: 'title',
          text: 'Hello World!',
        },
      ],
    },
  ],
})
```

Finally, run the startup file with bun:

```
node index.js
```

Or with bun:

```
bun run index.js
```

## Configuration

## Tool Examples

- [Invoices](https://github.com/solumy/engine/blob/main/examples/invoices) : manage your invoices and create pdf documents with personnalised design

You can run any example by cloning the repository and running the following command:

```
bun run example:<example-name>
```

- Énumérer les concepts de la technologie (lien vers la config à terme) + lien vers un exemple d'implémentation du concept + vers des tests
- On est ouvert aux contributions, liser notre contributing + code of conduct
- Premier fichier vu sur npm
