const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const userRoutes = require('../routes/userRoutes');
const authRoutes = require('../routes/authRoutes');
const activityRoutes = require('../routes/activityRoutes');
const feedbackRoutes = require('../routes/feedbackRoutes');
const { verifyToken } = require('../utils');


dotenv.config();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/activities', verifyToken, activityRoutes);
app.use('/activities', verifyToken, feedbackRoutes);

module.exports = app;
