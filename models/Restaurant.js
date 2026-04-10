const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Restaurant = sequelize.define('Restaurant', {
    name: DataTypes.STRING, 
    });

    module.exports = Restaurant;