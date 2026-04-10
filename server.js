const express = require('express');
const dotenv = require('dotenv')

dotenv.config();
const app = express();

const {sequelize} = require('./models');
const ordersRouter = require('./routes/orderRoutes');

app.use(express.json());
app.use('/', ordersRouter);

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