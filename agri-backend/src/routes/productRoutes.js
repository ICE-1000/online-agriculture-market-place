const express = require('express');
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { uploadProductImage } = require('../middleware/upload');
const {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} = require('../validations/productValidation');

const router = express.Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: List marketplace products
 *     tags: [Products]
 */
router.get('/', validate(productQuerySchema, 'query'), productController.listProducts);

/**
 * @openapi
 * /api/products/compare:
 *   get:
 *     summary: Compare product prices with similar products
 *     tags: [Products]
 */
router.get('/compare', productController.compareProduct);

/**
 * @openapi
 * /api/products/predictions:
 *   get:
 *     summary: Get price predictions for a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.get('/predictions', authenticate, productController.predictPrices);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product
 *     tags: [Products]
 */
router.get('/:id', productController.getProductById);

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Create a supplier product listing
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, uploadProductImage, validate(createProductSchema), productController.createProduct);

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     summary: Update a supplier product listing
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, uploadProductImage, validate(updateProductSchema), productController.updateProduct);

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a supplier product listing
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, productController.deleteProduct);

/**
 * @openapi
 * /api/products/{id}/mark-sold-out:
 *   post:
 *     summary: Mark a supplier product as sold out
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/mark-sold-out', authenticate, productController.markSoldOut);

/**
 * @openapi
 * /api/products/compare:
 *   get:
 *     summary: Compare product prices with similar products
 *     tags: [Products]
 */
router.get('/compare', productController.compareProduct);

/**
 * @openapi
 * /api/products/predictions:
 *   get:
 *     summary: Get price predictions for a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.get('/predictions', authenticate, productController.predictPrices);

module.exports = router;
