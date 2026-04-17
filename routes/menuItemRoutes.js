const express = require('express');
const router = express.Router();

const {MenuItem, Restaurant} = require('../models');
const { where } = require('sequelize');
const menuItemSchema = require('../validators/menuItemValidator');

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
 *                 minLength: 3
 *                 maxLength: 100
 *                 description: The name of the menu item (must be 3-100 characters)
 *                 example: "Pasta Carbonara"
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *                 description: The price of the menu item (must be positive)
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
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "\"price\" must be a positive number"
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
   const {error} = menuItemSchema.validate(req.body);
   if(error) {
    return res.status(400).json({
        message: error.details[0].message
    });
    }
    const menuItem = await MenuItem.create({
        name: req.body.name,
        price: req.body.price,
        RestaurantId: req.body.restaurantId
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

/**
 * @swagger
 * /menuItems/restaurant/{restaurantId}:
 *   get:
 *     summary: Get all menu items for a restaurant
 *     description: Retrieve all menu items associated with a specific restaurant by its ID
 *     tags:
 *       - Menu Items
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the restaurant
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Unique menu item identifier
 *                   name:
 *                     type: string
 *                     description: Menu item name
 *                   price:
 *                     type: number
 *                     description: Menu item price
 *                   RestaurantId:
 *                     type: integer
 *                     description: Associated restaurant ID
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the menu item was created
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the menu item was last updated
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
// GET MENU ITEMS BY RESTAURANT ID
router.get('/restaurant/:restaurantId', async (req,res) =>{
    try{
        const {restaurantId} = req.params;
        const menuItems = await MenuItem.findAll({
            where: {RestaurantId: restaurantId}
        });
        res.json(menuItems);

    } catch (error){
        console.error(error);
        res.status(500).json({
            message: 'Server error',
        });
    }
});

/**
 * @swagger
 * /menuItems/{id}:
 *   put:
 *     summary: Update a menu item
 *     description: Update an existing menu item's information by ID
 *     tags:
 *       - Menu Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the menu item to update
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 description: The new name of the menu item (must be 3-100 characters)
 *                 example: "Pasta Carbonara Deluxe"
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *                 description: The new price of the menu item (must be positive)
 *                 example: 14.99
 *     responses:
 *       200:
 *         description: Menu item successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Menu item updated successfully"
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
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "\"price\" must be a positive number"
 *       404:
 *         description: Menu item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Menu item not found"
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
// UPDATE MENU ITEM
router.put('/:id', async (req,res) => {
    try {
        const {error} = menuItemSchema.validate(req.body);
        if(error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        } 
        const menuItem = await MenuItem.findByPk(req.params.id);
        if (!menuItem) {
            return res.status(404).json({
                message: 'Menu item not found'
            });
        }
        await menuItem.update({
        name: req.body.name || menuItem.name,
        price: req.body.price || menuItem.price
        });
        
        res.json({
            message: 'Menu item updated successfully',
            data: menuItem
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({  
            message: 'Error updating menu item',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /menuItems/{id}:
 *   delete:
 *     summary: Delete a menu item
 *     description: Delete an existing menu item by ID
 *     tags:
 *       - Menu Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the menu item to delete
 *         example: 1
 *     responses:
 *       200:
 *         description: Menu item successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Menu item deleted successfully"
 *       404:
 *         description: Menu item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Menu item not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting menu item"
 */
// DELETE MENU ITEM
router.delete('/:id', async (req,res) => {
    try {
        const {id} = req.params;
        const menuItem = await MenuItem.findByPk(id);

        if (!menuItem) {
            return res.status(404).json({
                message: 'Menu item not found'
            });
        }
        await menuItem.destroy();
        res.json({
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
             message: 'Error deleting menu item',   
            
        }); 
    }
});    
module.exports = router;