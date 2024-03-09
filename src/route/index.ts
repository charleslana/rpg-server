import characterRoute from './characterRoute';
import publicRoute from './publicRoute';
import userCharacterRoute from './userCharacterRoute';
import userRoute from './userRoute';
import { Router } from 'express';

const routes = Router();

routes.use('/api/v1/public', publicRoute);

routes.use('/api/v1/user', userRoute);

routes.use('/api/v1/character', characterRoute);

routes.use('/api/v1/user-character', userCharacterRoute);

export default routes;
