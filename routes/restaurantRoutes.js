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

module.exports = router;
