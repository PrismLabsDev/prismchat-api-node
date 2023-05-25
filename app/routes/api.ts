import { Request, Response, Router } from 'express';

// Controllers
import AuthController from '../controllers/api/AuthController';
import MessageController from '../controllers/api/MessageController';

// Middleware
import AuthenticateJWT from '../middleware/AuthenticateJWT';

const router = Router();

// Auth
router.get('/auth/pubkey', AuthController.pubkey);
router.post('/auth/request', AuthController.request);
router.post('/auth/verify', AuthController.verify);

// Message
router.get('/message', AuthenticateJWT, MessageController.receive);
router.post('/message', MessageController.send);

export default router;
