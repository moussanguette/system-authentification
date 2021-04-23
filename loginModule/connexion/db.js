const Sequelize = require('sequelize');

const sequelize=new Sequelize('shoopApp','moussa','Moussa3001',{
    host : 'localhost',
    dialect : 'mysql'
})

module.exports = sequelize;