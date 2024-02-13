const { Sequelize } = require("sequelize");
const { sequelize } = require("../server");

const Activity = sequelize.define("Activity", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: Sequelize.INTEGER,
    description: Sequelize.TEXT,
    date: Sequelize.DATE,
    duration: Sequelize.TIME
})

module.exports = Activity;