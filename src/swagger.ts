import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import path from 'path';
import { config } from './config/config';

const options: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API',
            version: '1.0.0',
            description: 'REST API for Organizations and Users',
        },
        servers: [
            {
                url: `http://localhost:${config.server.port}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
    },
    apis: [path.join(__dirname, 'routes', '*.js')],
};

export const swaggerSpec = swaggerJSDoc(options);