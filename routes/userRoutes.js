const express = require('express');
const router = express.Router();
const { authUser, authorizePermissions } = require('../middleware/authentication');

const {
    getUsers,
    getUser,
    getProfile,
    update,
    updatePassword
} = require('../controllers/v1/userController');

router.route('/').get(authUser, authorizePermissions('admin'), getUsers);

router.route('/profile').get(getProfile);
router.route('/update').patch(update);
router.route('/updatePassword').patch(updatePassword);

router.route('/:id').get(authUser, getUser);

module.exports = router;
