import express from 'express'
import dotenv from 'dotenv'
import ReactDOMServer from 'react-dom/server'
import App from './app'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) ?? 3000

app.use(express.json())

app.get('/', (req, res) => {
  const html = ReactDOMServer.renderToString(<App />)
  res.send(`
      <!DOCTYPE html>
      <html>
          <head>
              <title>My App</title>
          </head>
          <body>
              <div id="app">${html}</div>
          </body>
      </html>
  `)
})

app.listen(PORT, () => {
  console.log(process.env.FOUNDATION_CONFIG)
  console.log(`Server is running at port ${PORT}`)
})
