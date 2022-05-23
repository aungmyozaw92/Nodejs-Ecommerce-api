const express = require('express');
const router = express.Router();
const { authUser, authorizePermissions } = require('../middleware/authentication');

const {
    index,
    show,
    create,
    update,
    destroy,
    upload
} = require('../controllers/v1/productController');

const { getProductReviews } = require('../controllers/v1/reviewController');

router.route('/').post([authUser, authorizePermissions('admin')], create)
                 .get(index);

router.route('/upload').post([authUser, authorizePermissions('admin')], upload);

router.route('/:id').get(show)
                    .patch([authUser, authorizePermissions('admin')], update)
                    .delete([authUser, authorizePermissions('admin')], destroy);

router.route('/:id/reviews').get(getProductReviews);

module.exports = router;
