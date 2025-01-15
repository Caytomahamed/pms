const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

// globalErorrHandle
const globalErorrHandle = require('./controllers/errorController.js');

//Router
const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');
const inventoryRouter = require('./routes/inventoryRoutes');
const replacementRouter = require('./routes/replacementRoutes');
const salesRouter = require('./routes/salesRoutes');
const reportRouter = require('./routes/reportRouter.js');

const app = express();

app.use(
  cors({
    origin: '*', // Replace with your frontend URL in production
  })
);

app.use(express.json());

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/inventory', inventoryRouter);
app.use('/api/v1/replacements', replacementRouter);
app.use('/api/v1/sales', salesRouter);
app.use('/api/v1/reports', reportRouter);

// automalically handle with deadline orders to completed
const orderController = require('./controllers/orderController');
const replacementController = require('./controllers/replacementController.js');

cron.schedule('0 0 * * *', () => {
  // Run every day at midnight
  console.log('Running scheduled task to update overdue orders...');
  orderController.automaticallyUpdateOrders();
  replacementController.automaticallyUpdateReplacement();
});

// 404
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// globaleError
app.use(globalErorrHandle);

module.exports = app;
