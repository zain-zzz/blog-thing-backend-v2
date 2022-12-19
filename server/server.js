const express = require('express')
const db = require('../db/db')
const app = express()
const PORT = 3003
const { Posts, Users } = require("../models")
const cors = require("cors")
const { Op } = require("sequelize")

app.use(cors())
app.use(express.json())

app.listen(PORT, async () => {
  //await db.sync({force: false})
  console.log(`listening on port ${PORT}`)
})

//create the server

app.get("/posts", async (req, res) => {
  res.send(await Posts.findAll())
})

app.get("/author/:input", async (req, res) => {
  res.send(await Posts.findAll({
    where: {
      username: req.params.input
    }
  }))
})

app.get("/findAuthor/:input", async (req, res) => {
  res.send(await Posts.findAll({
    where: {
      username: {
        [Op.like]: `%${req.params.input}%`
      }
    }
  }))
})

app.get('/', async (req,res) => {
  res.send(await Users.findAll())
})

app.post("/", async (req, res) => {
  const username = req.body.username
  const content = req.body.content
  await Posts.create({
    content,
    username
  })
  res.send('nice!')
})

app.post("/username", async (req, res) => {
  const username = req.body.username
  const email = req.body.email
  
  console.log(username,email)

  const [user,created] = await Users.findOrCreate({
    where: {
      username: username
    },
    defaults: {
      username: username,
      email: email
    }
  })

  console.log(created)

  res.status(200).send(created)

})

app.post("/getUsername", async(req,res) => {
  const email = req.body.email
  
  //console.log(email)

  const user = await Users.findOne({
    where: {
      email: email
    }
  })

  console.log(user.username)

  res.status(200).send(user.username)

})

app.get("/getPostsByEmail/:email", async (req, res) => {

  const email = req.params.email

  if (email != 'undefined') {
    const user = await Users.findOne({
      where: {
        email: email
      }
    })

    // const username = user.username
    res.send(await Posts.findAll({
      where: {
        //change to email when we sort out the username thing
        username: email
      }
    }))
  }
  else { res.status(400).send('no email')}

})