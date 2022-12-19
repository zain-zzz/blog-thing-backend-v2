const { Posts, Users } = require("../models")
const db = require("./db")
const infoToSeed = require("../templates/template")

const usersObj = []

async function seed (){
    await db.sync({force: true})

    for (let i = 0; i < infoToSeed.length; i++){

        const [userToAdd, created] = await Users.findOrCreate({
            where: {
                username: infoToSeed[i]["username"],
                email: infoToSeed[i]["email"]
            },
            defaults: {
                username: infoToSeed[i]["username"],
                email: infoToSeed[i]["email"]
            }
        })

        const postToAdd = await Posts.create({
            content: infoToSeed[i]["content"]
        })

        await userToAdd.addPost(postToAdd)

    }
    
    console.log('database is populated!!')

}

seed()