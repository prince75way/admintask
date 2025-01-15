import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { Express } from 'express';

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
