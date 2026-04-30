const sequelize = require('../config/database');
// Import models
const Restaurant = require('./Restaurant');
const MenuItem = require('./MenuItem');
const Customer = require('./Customer');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

//relationships
Restaurant.hasMany(MenuItem, {
    foreignKey: 'restaurantId'
});
MenuItem.belongsTo(Restaurant, {
    foreignKey: 'restaurantId'
});

Customer.hasMany(Order, {
    foreignKey: 'customerId'
});
Order.belongsTo(Customer, {
    foreignKey: 'customerId'
});

Restaurant.hasMany(Order, {
    foreignKey: 'restaurantId'
});
Order.belongsTo(Restaurant, {
    foreignKey: 'restaurantId'
});

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
