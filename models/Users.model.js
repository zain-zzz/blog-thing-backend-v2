const { DataTypes, Model } = require("sequelize");
const db = require('../db/db')
class Users extends Model { }

Users.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'Users'
})

module.exports = Users

//create Users model - the Users must have a username and password