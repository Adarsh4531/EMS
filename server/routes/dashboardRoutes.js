import  { Router } from 'express';
import  {getDashboard } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const dashboardRoutes = Router();

dashboardRoutes.get('/', protect,getDashboard);

export default dashboardRoutes;