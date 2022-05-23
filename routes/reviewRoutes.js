const express = require('express');
const router = express.Router();
const { authUser, authorizePermissions } = require('../middleware/authentication');

const {
    index,
    create,
    show,
    update,
    destroy
} = require('../controllers/v1/reviewController');

router
    .route('/')
    .post(authUser, create)
    .get(index);

router
    .route('/:id')
    .get(show)
    .patch(authUser, update)
    .delete(authUser, destroy);

module.exports = router;