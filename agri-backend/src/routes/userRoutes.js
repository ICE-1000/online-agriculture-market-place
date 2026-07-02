const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { changePasswordSchema } = require('../validations/authValidation');
const { uploadProfilePicture } = require('../middleware/upload');

const router = express.Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: List public user profiles
 *     tags: [Users]
 */
router.get('/', userController.listUsers);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get a public user profile by ID
 *     tags: [Users]
 */
router.get('/:id', userController.getUserById);

/**
 * @openapi
 * /api/users/profile:
 *   put:
 *     summary: Update authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.put('/profile', authenticate, userController.updateProfile);

/**
 * @openapi
 * /api/users/change-password:
 *   post:
 *     summary: Change authenticated user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.post('/change-password', authenticate, validate(changePasswordSchema), userController.changePassword);

/**
 * @openapi
 * /api/users/location:
 *   put:
 *     summary: Update authenticated user's location
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.put('/location', authenticate, userController.updateLocation);

/**
 * @openapi
 * /api/users/profile-picture:
 *   post:
 *     summary: Upload profile picture
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.post('/profile-picture', authenticate, uploadProfilePicture, userController.updateProfilePicture);

module.exports = router;