const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { handleErrorResponse } = require('../utils');
const { checkRole } = require('../utils');
const { checkActivityHasStarted } = require('../utils');

const Activity = require('../database/models/Activity');
const Feedback = require('../database/models/Feedback');

const router = express.Router();



router.post('/:id/feedbacks', checkRole('student'), checkActivityHasStarted, async function (req, res) {
    try {
        const activityId = req.params.id;

        const { emoji } = req.body;

        const activity = await Activity.findByPk(activityId);

        if (!activity) {
            return res.status(404).json({ success: false, message: "Activity not found", data: {} });
        }

        const newFeedback = await Feedback.create({
            activityId: activityId,
            emoji: emoji
        })

        return res.status(201).json({ success: true, message: "Feedback created", data: newFeedback });
    } catch (error) {
        handleErrorResponse(res, error, "Error creating feedback")
    }
})

router.get('/:id/feedbacks', checkRole('teacher'), async function (req, res) {
    try {

        const activityId = req.params.id;

        const feedbacks = await Feedback.findAll({
            where: {
                activityId: activityId
            }
        });

        let reactions = {}
        reactions.activity = await Activity.findByPk(activityId)
        reactions.smiley = feedbacks.filter(el => el.emoji == 1)
        reactions.frowny = feedbacks.filter(el => el.emoji == 2)
        reactions.surprised = feedbacks.filter(el => el.emoji == 3)
        reactions.confused = feedbacks.filter(el => el.emoji == 4)

        return res.status(200).json({ success: true, message: "Activities list for user", data: reactions })
    } catch (error) {
        handleErrorResponse(res, error, "Error retrieving feedbacks for activity")
    }
})



module.exports = router;