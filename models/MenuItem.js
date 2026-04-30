const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');


const MenuItem = sequelize.define('MenuItem', {
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2) ,
        restaurantId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Restaurant",
            key: 'id'
        }
    }
}
, {
    tableName: 'MenuItem',
    freezeTableName: true
});
module.exports = MenuItem;