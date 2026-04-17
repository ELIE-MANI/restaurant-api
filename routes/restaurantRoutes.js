const express = require('express');
const router = express.Router();

const {Restaurant} = require('../models')

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Create a new restaurant
 *     description: Creates a new restaurant in the system with the provided name
 *     tags:
 *       - Restaurants
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the restaurant
 *                 example: "Mario's Italian Kitchen"
 *     responses:
 *       201:
 *         description: Restaurant successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Restaurant created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Unique restaurant identifier
 *                     name:
 *                       type: string
 *                       description: Restaurant name
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the restaurant was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the restaurant was last updated
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Name is required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/', async (req,res) => {
    try {
        const {name} = req.body

        if(!name) {
            return res.status(400).json({message: 'Name is required'});
        }

        const restaurant = await Restaurant.create({name});
        res.status(201).json({
            message: 'Restaurant created successfully',
            data: restaurant
        });

    } catch (error) {
        console.error('Error creating restaurant:', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Get all restaurants
 *     description: Retrieve a list of all restaurants in the system
 *     tags:
 *       - Restaurants
 *     responses:
 *       200:
 *         description: Successfully retrieved all restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Unique restaurant identifier
 *                   name:
 *                     type: string
 *                     description: Restaurant name
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the restaurant was created
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the restaurant was last updated
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll();
        res.status(200).json({
            message: 'Restaurants retrieved successfully',
            data: restaurants
        });
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

/**
 * @swagger
 * /restaurants/{id}:
 *   put:
 *     summary: Update a restaurant
 *     description: Update an existing restaurant's information by ID
 *     tags:
 *       - Restaurants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the restaurant to update
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the restaurant
 *                 example: "Luigi's Italian Restaurant"
 *     responses:
 *       200:
 *         description: Restaurant successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Restaurant updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Unique restaurant identifier
 *                     name:
 *                       type: string
 *                       description: Restaurant name
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the restaurant was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the restaurant was last updated
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Restaurant not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
//UPDATE RESTAURANT

router.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {name} = req.body;

        const restaurant = await Restaurant.findByPk(id);

        if (!restaurant) {
            return res.status(404).json({
                message: 'Restaurant not found'
            });

        }
        restaurant.name = name || restaurant.name;

        await restaurant.save();

        res.json({
            message: 'Restaurant updated successfully',
            data: restaurant
        });
    } catch (error){
        console.error('Error updating restaurant:', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant
 *     description: Delete an existing restaurant by ID
 *     tags:
 *       - Restaurants
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the restaurant to delete
 *         example: 1
 *     responses:
 *       200:
 *         description: Restaurant successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Restaurant deleted successfully"
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Restaurant not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
// DELETE RESTAURANT

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const restaurant = await Restaurant.findByPk(id);

        if (!restaurant) {
            return res.status(404).json({
                message: 'Restaurant not found'
            });
        }
        await restaurant.destroy();
        res.json({
            message: 'Restaurant deleted successfully'
        });
    } catch (error){
        console.error('Error deleting restaurant:', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

module.exports = router;
