const express = require("express");
const router = express.Router();

const { Order, MenuItem, OrderItem, Customer } = require("../models");

router.get("/restaurants/:id/orders", async (req, res) => {
  const restaurantId = req.params.id;

  try {
    const orders = await Order.findAll({
      where: {
        RestaurantId: restaurantId,
        status: "active",
      },
      include: [
        {
          model: MenuItem,
          attributes: ["name", "price"],
          through: { attributes: ["quantity"] },
        },
      ],
    });

    //format the data
    const formatted = orders.map((order) => ({
      order_id: order.id,
      items: order.MenuItems.map((item) => ({
        item: item.name,
        price: item.price,
        quantity: item.OrderItem.quantity,
      })),
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Create a new  order

router.post("/orders", async (req, res) => {
  try {
    const { customerId, restaurantId, items } = req.body;
//Create order
    const order = await Order.create({
      CustomerId: customerId,
      RestaurantId: restaurantId,
      status: "active",
    });
    // Prepare order items data
    const orderItems = items.map((item) => {
      return {
        OrderId: order.id,
        MenuItemId: item.menuItemId,
        quantity: item.quantity,
      };
    });
    // save order items
    await OrderItem.bulkCreate(orderItems);
    // Respond with success message and order details
    res
      .status(201)
      .json({ message: "Order created successfully", orderId: order.id });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
});

module.exports = router;
