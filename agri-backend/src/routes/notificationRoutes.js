const express = require('express');
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * @openapi
 * /api/notifications:
 *   get:
 *     summary: Get user notification settings
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticate, notificationController.getNotifications);

/**
 * @openapi
 * /api/notifications:
 *   put:
 *     summary: Update user notification settings
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.put('/', authenticate, notificationController.updateNotifications);

module.exports = router;