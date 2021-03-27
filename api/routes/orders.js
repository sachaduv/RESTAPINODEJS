const express = require('express');
const routes = express.Router();
const OrdersController = require('../controllers/orders');

routes.get('/',OrdersController.orders_get_all_orders)

routes.post('/',OrdersController.orders_create_orders)

routes.get('/:orderId',OrdersController.orders_get_order_byid)


routes.delete('/:orderId',OrdersController.orders_delete_order)

module.exports = routes;