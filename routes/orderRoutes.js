const express = require('express');
const router = express.Router();

const { authUser, authorizePermissions } = require('../middleware/authentication');

const {
    index,
    show,
    create,
    update,
    getUserOrders,
} = require('../controllers/v1/orderController');

router
    .route('/')
    .post(authUser, create)
    .get(authUser, authorizePermissions('admin'), index);

router
    .route('/getUserOrders')
    .get(authUser, getUserOrders);

router
    .route('/:id')
    .get(authUser, show)
    .patch(authUser, update);

module.exports = router;