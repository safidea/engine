import 'module-alias/register'
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { join } from 'path'
import { FoundationController } from '@interface/api/FoundationController'

const app = express()
const foundationController = new FoundationController()
const PORT = Number(process.env.PORT ?? 3000)

app.use(express.json())

// Serve static files from the React build directory
app.use(express.static(join(process.cwd(), 'dist/public')))

app.get('/api', async (req, res) => {
  const json = await foundationController.route()
  res.json(json)
})

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(join(process.cwd(), 'public/index.html'))
})

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`)
})
