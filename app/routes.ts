import { Request, Response, Router } from 'express';

// Controllers
import IndexController from './controllers/IndexController';

const router = Router();

// Routes
router.get('/', IndexController.index);

export default router;
