const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const MenuItem = sequelize.define('MenuItem', {
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2) 
});
module.exports = MenuItem;