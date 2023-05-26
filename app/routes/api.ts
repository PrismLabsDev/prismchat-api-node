import { Request, Response, Router } from 'express';

// Controllers
import IdentifyController from '../controllers/api/IdentifyController';
import AuthController from '../controllers/api/AuthController';
import MessageController from '../controllers/api/MessageController';
import PushController from '../controllers/api/PushController';

// Middleware
import AuthenticateJWT from '../middleware/AuthenticateJWT';

const router = Router();

// Identify
router.get('/', IdentifyController.identify);
router.get('/identify', IdentifyController.identify);

// Auth
router.post('/auth/request', AuthController.request);
router.post('/auth/verify', AuthController.verify);

// Message
router.get('/message', AuthenticateJWT, MessageController.receive);
router.post('/message', MessageController.send);

// Push subscription
router.post('/push/subscribe', AuthenticateJWT, PushController.subscribe);
router.delete('/push/subscribe', AuthenticateJWT, PushController.unsubscribe);

export default router;
