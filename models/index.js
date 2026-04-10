const sequelize = require('../config/database');
// Import models
const Restaurant = require('./Restaurant');
const MenuItem = require('./MenuItem');
const Customer = require('./Customer');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

//relationships
Restaurant.hasMany(MenuItem);
MenuItem.belongsTo(Restaurant);

Customer.hasMany(Order);
Order.belongsTo(Customer);

Restaurant.hasMany(Order);
Order.belongsTo(Restaurant);

Order.belongsToMany(MenuItem, { through: OrderItem });
MenuItem.belongsToMany(Order, { through: OrderItem });

module.exports = {
     sequelize,
    Restaurant,
    MenuItem,
    Customer,
    Order,
    OrderItem
};
