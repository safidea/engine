import 'module-alias/register'
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import ReactDOMServer from 'react-dom/server'
import { getRootHtml } from '@infrastructure/client/root'
import { AppController } from '@adapter/api/controllers/AppController'

const app = express()
const appController = new AppController()
const PORT = Number(process.env.PORT ?? 3000)

app.use(express.json())

app.get('/api', async (req, res) => {
  const json = await appController.requestRoute()
  res.json(json)
})

app.get('*', async (req, res) => {
  const Page = await appController.getPage(req.url)
  const html = ReactDOMServer.renderToString(Page)
  res.send(getRootHtml(html))
})

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`)
})
