import 'module-alias/register'
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { AppController } from '@adapter/api/controllers/AppController'

const app = express()
const appController = new AppController()
const PORT = Number(process.env.PORT ?? 3000)

async function startServer() {
  try {
    // Run async code before starting the server
    await appController.configure()

    app.use(express.json())

    app.get('/api', async (req, res) => {
      const json = await appController.requestRoute()
      res.json(json)
    })

    app.get('/', async (req, res) => {
      const App = await appController.getPage('/')
      const html = ReactDOMServer.renderToString(App)
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>My React App</title>
          </head>
          <body>
            <div id="root">${html}</div>
          </body>
        </html>
      `)
    })

    // Serve static files from the React build directory
    //app.use(express.static(join(process.cwd(), 'dist/public')))

    // Handles any requests that don't match the ones above
    /*app.get('*', (req, res) => {
      res.sendFile(join(process.cwd(), 'public/index.html'))
    })*/

    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`)
    })
  } catch (error) {
    console.log('Error during server start: ', error)
  }
}

startServer()
