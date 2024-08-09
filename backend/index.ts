import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      contentBlocks: true,
    },
  })
  console.log(posts)
  res.json(posts)
})

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params
  const posts = await prisma.post.findMany({
    where: { id: Number(id) },
    include: {
      contentBlocks: true,
    },
  })
  console.log(posts)
  res.json(posts)
})

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)