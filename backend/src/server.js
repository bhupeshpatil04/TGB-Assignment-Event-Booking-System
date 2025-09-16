const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('express-async-errors');
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const reservationsRoutes = require('./routes/reservations');
const ticketsRoutes = require('./routes/tickets');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/reservations', reservationsRoutes);

app.use(errorHandler);

module.exports = app;
