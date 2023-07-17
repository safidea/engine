import 'module-alias/register'
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import ReactDOMServer from 'react-dom/server'
import { getRootHtml } from '@infrastructure/client/root'
import { AppController } from '@adapter/api/controllers/AppController'
import { PageRoutes } from '@adapter/api/routes/PageRoutes'
import { TableRoutes } from '@adapter/api/routes/TableRoutes'

const app = express()
const appController = new AppController()
const port = Number(process.env.PORT ?? 3000)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

async function startServer() {
  try {
    await appController.configure()
    const pageRoutes = new PageRoutes(appController)
    const tableRoutes = new TableRoutes(appController)

    app.get('/api/table/:table:/id', async (req, res) => {
      const json = await tableRoutes.get({
        method: req.method,
        path: req.url,
        params: req.params,
        body: req.body,
      })
      res.json(json)
    })

    app.get('/api/table/:table', async (req, res) => {
      const json = await tableRoutes.get({
        method: req.method,
        path: req.url,
      })
      res.json(json)
    })

    app.post('/api/table/:table', async (req, res) => {
      const json = await tableRoutes.post({
        method: req.method,
        path: req.url,
        params: req.params,
        body: req.body,
      })
      res.json(json)
    })

    app.get('*', async (req, res) => {
      const Page = await pageRoutes.get(req.url)
      const html = ReactDOMServer.renderToString(Page)
      res.send(getRootHtml(html))
    })

    app.listen(port, () => {
      console.log(`Server is running at port ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

startServer()
