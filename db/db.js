const { Sequelize } = require("sequelize");
const path = require('path')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'Posts.sqlite'),
  logging: false
})

module.exports = db

//create the new db