const express = require("express");
const router = express.Router();

const { Order, MenuItem, OrderItem, Customer, Restaurant } = require("../models");
const {orderSchema, orderStatusSchema} = require("../validators/orderValidator");

/**
 * @swagger
 * /restaurants/{id}/orders:
 *   get:
 *     summary: Get all active orders for a restaurant
 *     description: Retrieve all active orders for a specific restaurant with associated menu items
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Successfully retrieved orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   order_id:
 *                     type: integer
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         item:
 *                           type: string
 *                         price:
 *                           type: number
 *                         quantity:
 *                           type: integer
 *       500:
 *         description: Failed to fetch orders
 */
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

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     description: Retrieve order details including status and associated menu items with quantities
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Successfully retrieved order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order_id:
 *                   type: integer
 *                   description: Unique order identifier
 *                 status:
 *                   type: string
 *                   enum: [active, completed, cancelled]
 *                   description: Current order status
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       item:
 *                         type: string
 *                         description: Menu item name
 *                       price:
 *                         type: number
 *                         description: Item price in dollars
 *                       quantity:
 *                         type: integer
 *                         description: Quantity ordered
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to fetch order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// get one order by id
router.get("/orders/:id", async (req, res) => {
    try{
        const orderId = req.params.id;

        const order = await Order.findOne({
            where: {id: orderId},
            include: [
                {
                    model: MenuItem,
                    attributes: ['name', 'price'],
                    through: {attributes: ['quantity']}
                },
            ]
        });
        if(!order){
            return res.status(404).json({message: "Order not found"});
        }

        const formatted = {
            order_id: order.id,
            status: order.status,
            items: order.MenuItems.map(item => ({
                item: item.name,
                price: item.price,
                quantity: item.OrderItem.quantity
            }))
        };
        res.json(formatted);
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Failed to fetch order"});
    }
});
// Create a new  order

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order for a customer at a restaurant with specified menu items
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - restaurantId
 *               - items
 *             properties:
 *               customerId:
 *                 type: integer
 *                 description: ID of the customer placing the order (must be a positive integer)
 *               restaurantId:
 *                 type: integer
 *                 description: ID of the restaurant (must be a positive integer)
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 description: Array of menu items to order (must contain at least 1 item)
 *                 items:
 *                   type: object
 *                   required:
 *                     - menuItemId
 *                     - quantity
 *                   properties:
 *                     menuItemId:
 *                       type: integer
 *                       description: ID of the menu item (must be a positive integer)
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       description: Quantity of the item to order (must be a positive integer)
 *           example:
 *             customerId: 1
 *             restaurantId: 1
 *             items:
 *               - menuItemId: 1
 *                 quantity: 2
 *               - menuItemId: 3
 *                 quantity: 1
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 orderId:
 *                   type: integer
 *                   description: ID of the newly created order
 *       400:
 *         description: Bad request - validation errors (invalid data types, missing required fields, or invalid values)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               customerIdRequired:
 *                 summary: Missing customerId
 *                 value:
 *                   message: "\"customerId\" is required"
 *               restaurantIdRequired:
 *                 summary: Missing restaurantId
 *                 value:
 *                   message: "\"restaurantId\" is required"
 *               customerIdInvalid:
 *                 summary: Invalid customerId type
 *                 value:
 *                   message: "\"customerId\" must be a number"
 *               restaurantIdInvalid:
 *                 summary: Invalid restaurantId type
 *                 value:
 *                   message: "\"restaurantId\" must be a number"
 *               itemsMin:
 *                 summary: Items array is empty
 *                 value:
 *                   message: "\"items\" must contain at least 1 items"
 *               quantityPositive:
 *                 summary: Quantity is not positive
 *                 value:
 *                   message: "\"items[0].quantity\" must be a positive number"
 *       500:
 *         description: Failed to create order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.post("/orders", async (req, res) => {
  try {
    const { customerId, restaurantId, items } = req.body;

    // Validate request body
    const {error} = orderSchema.validate(req.body);
    
    if(error){
        return res.status(400).json({
          message: error.details[0].message});
    }
    const customer = await Customer.findByPk(customerId);
    if(!customer){
      return res.status(400).json({message: "Customer not found"});
    }
    
    const restaurant = await Restaurant.findByPk(restaurantId);
    if(!restaurant){
      return res.status(400).json({message: "Restaurant not found"});
    }
  
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

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update order status
 *     description: Update the status of an existing order (active, completed, or cancelled)
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, completed, cancelled]
 *                 description: New order status
 *           example:
 *             status: completed
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Failed to update order
 */
router.put("/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const validStatuses = ["active", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.update({ status });
    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update order", message: error.message });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     description: Cancel and remove an order from the system
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Order not found
 *       500:
 *         description: Failed to delete order
 */
router.delete("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.destroy();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete order", message: error.message });
  }
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check if the API server is running and database is connected
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Restaurant API is running", 
    timestamp: new Date().toISOString() 
  });
});

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     description: Update the status of an existing order using PATCH method. Status must be one of active, completed, or cancelled.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to update
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, completed, cancelled]
 *                 description: The new status for the order (must be one of active, completed, or cancelled)
 *           examples:
 *             completed:
 *               summary: Mark order as completed
 *               value:
 *                 status: "completed"
 *             cancelled:
 *               summary: Mark order as cancelled
 *               value:
 *                 status: "cancelled"
 *             active:
 *               summary: Mark order as active
 *               value:
 *                 status: "active"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order status updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Order ID
 *                     CustomerId:
 *                       type: integer
 *                       description: Customer ID
 *                     RestaurantId:
 *                       type: integer
 *                       description: Restaurant ID
 *                     status:
 *                       type: string
 *                       enum: [active, completed, cancelled]
 *                       description: Current order status
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the order was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the order was last updated
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               statusRequired:
 *                 summary: Missing status field
 *                 value:
 *                   message: "\"status\" is required"
 *               statusInvalid:
 *                 summary: Invalid status value
 *                 value:
 *                   message: "\"status\" must be one of [active, completed, cancelled]"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 *       500:
 *         description: Failed to update order status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
// UPDATE STATUS ORDER

router.patch('/orders/:id/status', async (req,res) => {
  try {
    const {id} = req.params;

    // Validate request body
    const {error} = orderStatusSchema.validate(req.body);
    if(error){
      return res.status(400).json({ 
        message: error.details[0].message
       });  
    }
    const {status} = req.body;

    // Find the order by ID
    const order = await Order.findByPk(id);

    if(!order){
      return res.status(404).json({message: "Order not found"});
    }

    // Update the order status
    order.status = status;
    await order.save();

    res.json({
      message: "Order status updated successfully",
      data: order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Failed to update order status",
      error: error.message
     });
  }
})

module.exports = router;
