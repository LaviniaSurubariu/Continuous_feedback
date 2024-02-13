const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { handleErrorResponse, checkRole, checkActivityHasStarted } = require('../utils');

const User = require('../database/models/User');
const Activity = require('../database/models/Activity');

const router = express.Router();

router.get('/', checkRole('teacher'), async function (req, res) {
    try {
        const activities = await Activity.findAll();

        res.status(200).json({ success: true, message: "Activities list", data: activities });
    } catch (error) {
        handleErrorResponse(res, error, "Error retrieving activities")
    }
})

router.get('/user', checkRole('teacher'), async function (req, res) {
    try {
        const userId = req.userId;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found", data: {} });
        }

        const activities = await Activity.findAll({
            where: {
                userId: userId
            }
        })

        return res.status(200).json({ success: true, message: "Activities list for user", data: activities })
    } catch (error) {
        handleErrorResponse(res, error, "Error retrieving activities for user")
    }
})




router.get('/check/:id', checkActivityHasStarted, async function (req, res) {
    try {
        const id = req.params.id;

        const activity = await Activity.findByPk(id);

        if (!activity) {
            return res.status(404).json({ success: false, message: 'Activity not found', data: {} });
        }

        return res.status(200).json({ success: true, message: "Activity found", data: activity });
    } catch (error) {
        handleErrorResponse(res, error, 'Error checking activity');
    }
});


router.post('/', checkRole('teacher'), async function (req, res) {
    try {
        const userId = req.userId;
        const { date, duration, description } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found", data: {} });
        }

        const newActivity = await Activity.create({
            userId: userId,
            description: description,
            date: date,
            duration: duration

        })

        return res.status(201).json({ success: true, message: "Activity created", data: newActivity });
    } catch (error) {
        handleErrorResponse(res, error, "Error creating activity")
    }
})

router.put('/:id', checkRole('teacher'), async function (req, res) {
    try {
        const userId = req.userId;
        const activityId = req.params.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found", data: {} });
        }

        const activity = await Activity.findByPk(activityId)

        if (!activity) {
            return res.status(404).json({ success: false, message: "Activity not found", data: {} });
        }

        if (userId !== activity.dataValues.userId) {
            return res.status(404).json({ success: false, message: "Not the same creator", data: {} });
        }

        const updatedActivity = await activity.update(req.body);

        return res.status(200).json({ success: true, message: "Activity updated", data: updatedActivity });
    } catch (error) {
        handleErrorResponse(res, error, "Error updating activity")
    }
})

router.delete('/:id', checkRole('teacher'), async function (req, res) {
    try {
        const id = req.params.id;

        const activity = await Activity.findByPk(id);

        if (!activity) {
            res.status(404).json({ success: false, message: 'Error finding activity', data: {} });
        }

        await activity.destroy();

        res.status(200).json({ success: true, message: "Activity deleted", data: {} });
    } catch (error) {
        handleErrorResponse(res, error, 'Error deleting activity');
    }
})

module.exports = router;