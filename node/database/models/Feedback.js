const { Sequelize } = require("sequelize");
const { sequelize } = require("../server");

const Feedback = sequelize.define("Feedback", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    activityId: Sequelize.INTEGER,
    time: {
        type: Sequelize.DATE, defaultValue: Sequelize.NOW
    },
    emoji: Sequelize.INTEGER
});

module.exports = Feedback;