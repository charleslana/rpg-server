import express from 'express';
import { PublicController } from 'controller/PublicController';

const publicRoute = express.Router();

const controller = new PublicController();

publicRoute.route('/version').get(controller.getVersion);

export default publicRoute;
