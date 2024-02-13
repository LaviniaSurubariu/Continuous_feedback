const jwt = require('jsonwebtoken');
const User = require('./database/models/User')
const Activity = require('./database/models/Activity')
const moment = require('moment');


const handleErrorResponse = (res, error, message, statusCode = 500) => {
    console.error(`Error: ${message}`, error);
    return res.status(statusCode).json({ success: false, message: `Error ${message}.` });
};

const verifyToken = (req, res, next) => {
    const bearerToken = req.headers['authorization'];
    const token = bearerToken?.split(' ')[1];

    if (!token) {
        return handleErrorResponse(res, null, 'Unauthorized - No token provided', 401);
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return handleErrorResponse(res, null, 'Unauthorized - Invalid token', 401);
        }

        req.userId = decoded.id;

        next();
    })
}

const checkRole = function checkRole(role) {
    return async function (req, res, next) {
        if (req.userId) {
            const user = await User.findByPk(req.userId);
            if (user && user.role == role) {
                next()
            } else {
                return handleErrorResponse(res, null, 'Forbidden', 403);
            }
        } else {
            return handleErrorResponse(res, null, 'Forbidden', 403);
        }
    }
}


const checkActivityHasStarted = async function checkActivityHasStarted(req, res, next) {
    try {
        const activityId = req.params.id;

        const activity = await Activity.findByPk(activityId);

        if (!activity) {
            return handleErrorResponse(req, null, 'Activity not found', 404);
        }

        const now = moment();
        const activityStart = moment(activity.date);
        const duration = moment(activity.duration, 'HH:mm:ss');
        const activityEnd = moment(activity.date).add(duration.hours(), 'hours').add(duration.minutes(), 'minutes').add(duration.seconds(), 'seconds');


        if (!now.isBetween(activityStart, activityEnd)) {

            return handleErrorResponse(res, null, 'Activity is not in progress', 403);

        }

        next();

    } catch (error) {
        console.error(error);
        return handleErrorResponse(res, null, 'An error occurred while checking the activity.', 500);

    }
}


module.exports = {
    handleErrorResponse,
    verifyToken,
    checkRole,
    checkActivityHasStarted
}