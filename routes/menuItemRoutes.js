const express = require('express');
const router = express.Router();

const {MenuItem, Restaurant} = require('../models');

/**
 * @swagger
 * /menuItems:
 *   post:
 *     summary: Create a new menu item
 *     description: Creates a new menu item for a specific restaurant with name and price information
 *     tags:
 *       - Menu Items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - restaurantId
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the menu item
 *                 example: "Pasta Carbonara"
 *               price:
 *                 type: number
 *                 description: The price of the menu item
 *                 example: 12.99
 *               restaurantId:
 *                 type: integer
 *                 description: The ID of the restaurant this menu item belongs to
 *                 example: 1
 *     responses:
 *       201:
 *         description: Menu item successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Menu item created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Unique menu item identifier
 *                     name:
 *                       type: string
 *                       description: Menu item name
 *                     price:
 *                       type: number
 *                       description: Menu item price
 *                     RestaurantId:
 *                       type: integer
 *                       description: Associated restaurant ID
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the menu item was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the menu item was last updated
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Name, price, and restaurantId are required"
 *       500:
 *         description: Internal server error
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
router.post('/', async (req,res) => {

try {
        const {name, price, restaurantId} = req.body
    if (!name || !price || !restaurantId) {
        return res.status(400).json({
            message: 'Name, price, and restaurantId are required'
        });
    }
    const menuItem = await MenuItem.create({
        name,
        price,
        RestaurantId: restaurantId
    });
    res.status(201).json({
        message: 'Menu item created successfully',
        data: menuItem
    });

    } catch (error) {
        res.status(500).json({
            message: 'Error creating menu item',
            error: error.message
        });
    }
});

module.exports = router;