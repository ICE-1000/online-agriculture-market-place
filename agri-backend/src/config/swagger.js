const swaggerJsdoc = require('swagger-jsdoc');
const { config } = require('./config');

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AgriMart API',
      version: '1.0.0',
      description: 'Production-ready REST API for AgriMart, a Zambian agricultural marketplace.',
    },
    servers: [
      {
        url: config.apiUrl,
        description: `${config.env} server`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
});

module.exports = swaggerSpec;
