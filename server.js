import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()

// Fix __dirname (ES module)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Serve static files
app.use(express.static(path.join(__dirname, 'public')))

// Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Simple API route for testing
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running!', time: new Date().toLocaleString() })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
app.get('/', (req, res) => {
  res.send('Server is working 🚀')
})