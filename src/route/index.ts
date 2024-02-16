import userRoute from './userRoute';
import { Router } from 'express';

const routes = Router();

routes.use('/api/v1/user', userRoute);

export default routes;
