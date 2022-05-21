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

router.route('/profile').get(authUser, getProfile);
router.route('/update').patch(authUser, update);
router.route('/updatePassword').patch(authUser, updatePassword);

router.route('/:id').get(authUser, getUser);

module.exports = router;
