const express = require("express");
const db = require("../db/db");
const app = express();
const PORT = 3003;
const { Posts, Users } = require("../models");
const cors = require("cors");
const { Op } = require("sequelize");
const fileUpload = require("express-fileupload");

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.listen(PORT, async () => {
  console.log(`listening on port ${PORT}`);
});

//create the server

app.get("/posts", async (req, res) => {
  const posts = await Posts.findAll();

  let postsToSend = [];

  for (let i = 0; i < posts.length; i++) {
    try {
      const user = await Users.findByPk(posts[i].UserId);
      postsToSend.push({
        content: posts[i].content,
        username: user.username,
      });
    } catch (e) {
      console.log(`${posts[i].UserId}'s post Failed to load`)
    }
  }

  res.send(postsToSend);
});

app.get("/author/:input", async (req, res) => {
  res.send(
    await Posts.findAll({
      where: {
        username: req.params.input,
      },
    })
  );
});

app.get("/findAuthor/:input", async (req, res) => {
  res.send(
    await Posts.findAll({
      where: {
        username: {
          [Op.like]: `%${req.params.input}%`,
        },
      },
    })
  );
});

app.get("/", async (req, res) => {
  res.send(await Users.findAll());
});

app.post("/", async (req, res) => {
  const username = req.body.username;
  const content = req.body.content;

  const userToAdd = await Users.findOne({
    where: {
      email: username,
    },
  });

  const postToAdd = await Posts.create({
    content,
    username,
  });

  await userToAdd.addPost(postToAdd);

  res.send("nice!");
});

app.post("/username", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;

  console.log(username, email);

  const [user, created] = await Users.findOrCreate({
    where: {
      username: username,
    },
    defaults: {
      username: username,
      email: email,
    },
  });

  //console.log(created)

  res.status(200).send(created);
});

app.get("/getUsername/:email", async (req, res) => {
  const email = req.params.email;

  //console.log(email)

  await Users.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      //console.log(user.username)
      res.status(200).send(user.username);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/getPostsByEmail/:email", async (req, res) => {
  const email = req.params.email;

  await Users.findOne({
    where: {
      email: email,
    },
  })
    .then(async (user) => {
      res.send(
        await Posts.findAll({
          where: {
            UserId: user.id,
          },
        })
      );
    })
    .catch((error) => {
      //console.log('')
    });
});

app.post("/upload", (req, res) => {
  if (req.files === null) {
    console.log("error 1");
    return res.status(400).json({ msg: "No file uploaded" });
  }
  if (req.body.username === null) {
    console.log("error 2");
    return res.status(400).json({ msg: "No username uploaded" });
  }

  const username = req.body.username

  const file = req.files.file;

  //const username = req.body.username;

  file.mv(`${__dirname}/uploads/${username}-PFP.png`, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${username}-PFP.png` });
  });
});

app.get("/images/:name", (req, res) => {
  res.sendFile(`${__dirname}/uploads/${req.params.name}`);
});

app.delete("/username/:email", async(req,res) => {
  const email = req.params.email
  
  console.log(email)

  await Users.destroy({
    where: {
      email: email
    }
  })

  res.status(200).send('deleted')

})
