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
 *     description: >
 *       Public, unauthenticated. Used to join supplier names/photos onto
 *       product listings on the frontend.
 *     tags: [Users]
 *     security: []
 *     responses:
 *       200:
 *         description: All user profiles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', userController.listUsers);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get a single public profile by id
 *     tags: [Users]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: The user's id (matches a product's `supplierId`).
 *     responses:
 *       200:
 *         description: The requested user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', userController.getUserById);

/**
 * @openapi
 * /api/users/profile:
 *   put:
 *     summary: Update the authenticated user's profile
 *     description: >
 *       Cannot change `username`, `email`, or `role` — only name, phone,
 *       location, and province.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileInput'
 *     responses:
 *       200:
 *         description: Updated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: A `role` field was included, or no fields were sent.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put('/profile', authenticate, userController.updateProfile);

/**
 * @openapi
 * /api/users/change-password:
 *   post:
 *     summary: Change the authenticated user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordInput'
 *     responses:
 *       200:
 *         description: Password changed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Not authenticated, or `currentPassword` is incorrect.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/change-password', authenticate, validate(changePasswordSchema), userController.changePassword);

/**
 * @openapi
 * /api/users/location:
 *   put:
 *     summary: Update the authenticated user's location text fields
 *     description: >
 *       Free-text location/province on the profile — not map coordinates.
 *       (Only products carry latitude/longitude; see the Products schema.)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLocationInput'
 *     responses:
 *       200:
 *         description: Updated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put('/location', authenticate, userController.updateLocation);

/**
 * @openapi
 * /api/users/profile-picture:
 *   post:
 *     summary: Upload/replace the authenticated user's profile picture
 *     description: >
 *       Replaces the current photo; the previous file is deleted from
 *       storage once the new one is saved.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [profilePicture]
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: jpeg/jpg/png/gif/webp, up to 5MB.
 *     responses:
 *       200:
 *         description: Updated user, including the new `profilePicture` URL.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: No file provided, or an unsupported file type.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/profile-picture', authenticate, uploadProfilePicture, userController.updateProfilePicture);

module.exports = router;
