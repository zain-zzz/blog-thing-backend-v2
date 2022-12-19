
const Posts = require('./Posts.model')
const Users = require('./Users.model')

//relationship
Users.hasMany(Posts)
Posts.belongsTo(Users)

module.exports = {
    Posts,
    Users
}