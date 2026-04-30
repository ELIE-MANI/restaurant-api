const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
    quantity: DataTypes.INTEGER
}
, {
    tableName: 'OrderItem',
    freezeTableName: true
});
module.exports = OrderItem;
