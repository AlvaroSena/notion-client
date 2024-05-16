import express from 'express'
import { routes } from './infra/http/routes'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())
app.use(routes)

app.get('/', (req, res) => {
  return res.json({ message: 'hello, world' })
})

app.get('/success', (req, res) => {
  return res.json({ message: 'Email confirmed successfully' })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
