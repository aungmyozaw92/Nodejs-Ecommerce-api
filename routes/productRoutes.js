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

router.route('/').post([authUser, authorizePermissions('admin')], create)
                 .get(index);

router.route('/upload').post([authUser, authorizePermissions('admin')], upload);

router.route('/:id').get(show)
                    .patch([authUser, authorizePermissions('admin')], update)
                    .delete([authUser, authorizePermissions('admin')], destroy);

module.exports = router;
