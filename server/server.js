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
  console.log(`listening on port ${PORT}`)
})

//create the server

app.get("/posts", async (req, res) => {

  const posts = await Posts.findAll()

  let postsToSend = []

  for (let i = 0; i < posts.length; i++) {


    const user = await Users.findByPk(posts[i].UserId)
    postsToSend.push({
      content: posts[i].content,
      username: user.username
    }) 



  }

  res.send(postsToSend)

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

  const userToAdd = await Users.findOne({
    where: {
      email: username
    }
  })

  const postToAdd = await Posts.create({
    content,
    username
  })

  await userToAdd.addPost(postToAdd)

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

app.get("/getUsername/:email", async(req,res) => {
  const email = req.params.email
  
  //console.log(email)

  await Users.findOne({
    where: {
      email: email
    }
  }).then( user => {
    console.log(user.username)
    res.status(200).send(user.username)
  }).catch( error => {
    console.log(error)
  })


})

app.get("/getPostsByEmail/:email", async (req, res) => {

  const email = req.params.email

  await Users.findOne({
    where: {
      email: email
    }
  }).then( async (user) => {
    res.send(await Posts.findAll({
      where: {
        UserId: user.id
      }
    }))
  }).catch(error => {
    console.log('error')
    // lets push this change to github - so that i can clone
  })

  // if (email != 'undefined') {
  //   const user = await Users.findOne({
  //     where: {
  //       email: email
  //     }
  //   })
  //   console.log(user.id)
  //   console.log(user.username)

  //   // const username = user.username
  //   res.send(await Posts.findAll({
  //     where: {
  //       //change to email when we sort out the username thing
  //       UserId: user.id
  //     }
  //   }))
  // }
  // else { res.status(400).send(['no email']) }

})