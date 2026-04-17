const express = require('express');
const router = express.Router();

const {Restaurant} = require('../models')

//Create new restaurant

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

module.exports = router;
