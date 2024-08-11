const fs = require('fs');
const path = require('path');
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
    const postsDir = path.join(__dirname, './posts');
    try{
      const files = await fs.promises.readdir(postsDir);
      for (const file of files) {
        const filePath = path.join(postsDir, file);
        await seedDb(filePath);
      }
    } catch(err){
      console.log(err)
    }
}

async function seedDb(filePath: string) {
    const postData: string[] = fs.readFileSync(filePath, 'utf-8').trim().split('$$').filter((part:string) => part !== "" && part !== "\n")
    const title: string = postData[0]

    try{
      const content = postData.slice(1).map(p => {
          if(p.startsWith("*img*")){
              return {imageUrl: p.slice(5)}
          }else {
              return {text: p}
          }
      })
      await prisma.post.create({
          data: {
            title: title,
            contentBlocks: {
              create: content,
          },
        }
      })
  } catch(err) {
    console.log("error seeding data: " + err)
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })