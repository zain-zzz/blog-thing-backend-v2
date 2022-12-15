const { DataTypes, Model } = require("sequelize");
const db = require('../db/db')
class Posts extends Model { }

Posts.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: db,
    modelName: 'Posts'
})

module.exports = Posts

//create Posts model - the Posts must have a username and password