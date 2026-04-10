const express = require('express');
const router = express.Router();

const {Order, MenuItem} = require('../models');

router.get('/restaurants/:id/orders', async (req, res) => {
    const restaurantId = req.params.id;

    try {
        const orders = await Order.findAll({
            where:{
                restaurantId: restaurantId,
                status: 'active'
            },
            include: [
                {
                 model: MenuItem,
                attributes: ['name', 'price'],
                    through: { attributes: ['quantity'] }  
                }
            ]
        });

     //format the data
      const formatted = orders.map(order => ({
        order_id: order.id,
        items: order.MenuItems.map(item => ({
         item: item.name,
         price: item.price,
         quantity: item.OrderItem.quantity
        }))
     }));
     
        res.json(formatted);
    }
       
     catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch orders' });
        }
});



module.exports = router;