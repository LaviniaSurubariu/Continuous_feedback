const express = require('express');
const bcrypt = require('bcrypt');
const { handleErrorResponse } = require('../utils');

const User = require('../database/models/User');

const router = express.Router();

router.get('/', async function (req, res) {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });

        return res.status(200).json(users);
    } catch (error) {
        handleErrorResponse(res, error, 'Error retrieving users');
    }
})

router.get('/:id', async function (req, res) {
    try {
        const id = req.params.id;

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            res.status(404).json({ success: false, message: 'Error finding user', data: {} });
        }

        res.status(200).json({ success: true, message: 'User was found', data: user })
    } catch (error) {
        handleErrorResponse(res, error, 'Error finding user');
    }
})

router.post('/', async function (req, res) {
    try {
        const { username, password, email, role } = req.body;

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const createdUser = await User.create({
            username,
            password: hashedPassword,
            email,
            role
        });

        res.status(201).json(createdUser);
    } catch (error) {
        handleErrorResponse(res, error, 'Error creating users');
    }
})

router.put('/:id', async function (req, res) {
    try {
        const id = req.params.id;

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            res.status(404).json({ success: false, message: 'Error finding user', data: {} });
        }

        const updatedUser = await user.update(req.body, {
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({ success: true, message: "User updated", data: updatedUser });
    } catch (error) {
        handleErrorResponse(res, error, 'Error updating user');
    }
})

router.delete('/:id', async function (req, res) {
    try {
        const id = req.params.id;

        const user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({ success: false, message: 'Error finding user', data: {} });
        }

        await user.destroy();

        res.status(200).json({ success: true, message: "User deleted", data: {} });
    } catch (error) {
        handleErrorResponse(res, error, 'Error deleting user');
    }
})

module.exports = router;