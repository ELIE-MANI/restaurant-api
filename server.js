const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();
const app = express();

const {sequelize} = require('./models');
const ordersRouter = require('./routes/orderRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant API',
      version: '1.0.0',
      description: 'A comprehensive API for managing restaurant orders, customers, and menu items',
      contact: {
        name: 'Elie Maniraguha',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
   
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use('/', ordersRouter);
app.use('/menuItems', menuItemRoutes);
app.use('/restaurants', restaurantRoutes);

const PORT = process.env.PORT || 3000;
sequelize.sync({force: false })
.then(() => {
   console.log('Database synced');
   app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
    });
})
.catch(err => {
    console.error('Unable to sync database:', err);
});