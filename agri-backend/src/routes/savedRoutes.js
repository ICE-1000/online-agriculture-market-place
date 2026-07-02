const express = require('express');
const savedController = require('../controllers/savedController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * @openapi
 * /api/saved:
 *   get:
 *     summary: List authenticated user's saved products
 *     tags: [Saved Products]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticate, savedController.listSavedProducts);

/**
 * @openapi
 * /api/saved/{productId}:
 *   post:
 *     summary: Toggle a saved product
 *     tags: [Saved Products]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:productId', authenticate, savedController.toggleSavedProduct);

/**
 * @openapi
 * /api/saved/{productId}:
 *   delete:
 *     summary: Remove a saved product
 *     tags: [Saved Products]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:productId', authenticate, savedController.removeSavedProduct);

module.exports = router;
