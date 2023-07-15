import express from 'express'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT ?? 3000)

app.use(express.json())

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '../../public')))

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../public/index.html'))
})

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`)
})
