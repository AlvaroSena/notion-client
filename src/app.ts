import express from 'express'

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  return res.json({ message: 'hello, world' })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
