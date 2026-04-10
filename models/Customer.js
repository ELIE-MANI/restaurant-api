const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
    name: DataTypes.STRING, 
    email: DataTypes.STRING
});

module.exports = Customer;