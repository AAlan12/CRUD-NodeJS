const Sequelize = require('sequelize');
const sequelize = new Sequelize('crud', 'root', '123456', {
    host: "localhost",
    dialect: 'mysql'
})

// sequelize.authenticate().then(function(){
//     console.log("Successfully connected")
// }).catch(function(erro){
//     console.log("Failed to connect: "+erro)
// })

module.exports = {Sequelize, sequelize}