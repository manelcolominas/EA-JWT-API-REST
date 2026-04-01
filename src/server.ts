import express, { Express } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import logger from './library/logger';

import { config } from './config/config';
import { swaggerSpec } from './swagger';
import { insertData } from './utils/dataSeeder.util';

import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import organizationRoutes from './routes/organization.route';

const app: Express = express(); // Explicitly type as Express

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        insertData();
        StartServer();
    })
    .catch((error) => {
        logger.error('Failed to connect to MongoDB:');
        logger.error(error);
        process.exit(1);
    });

const StartServer = () => {
    // Explicitly type the middleware functions
    app.use(express.json() as express.RequestHandler);
    app.use(express.urlencoded({ extended: true }) as express.RequestHandler);
    //app.use(cors() as express.RequestHandler);
    app.use(cors({
        origin: process.env.CLIENT_URL || 'http://localhost:4200',
        credentials: true
    }));
    app.use(cookieParser());
    
    // Rest of your middleware...
    
    //app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use('/auth', authRoutes);
    app.use('/users', userRoutes);
    app.use('/organizations', organizationRoutes);
    
    app.get('/ping', (req, res) => res.status(200).json({ message: 'pong' }));
    
    app.use((req, res) => {
        res.status(404).json({ message: 'Not found' });
    });
    
    http.createServer(app).listen(config.server.port, () => {
        logger.info(`Server running on port ${config.server.port}`);
    });
};