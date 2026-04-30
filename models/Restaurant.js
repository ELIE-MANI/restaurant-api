const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Restaurant = sequelize.define('Restaurant', {
    name: DataTypes.STRING
}, {
    tableName: 'Restaurant',
    freezeTableName: true
});

    module.exports = Restaurant;