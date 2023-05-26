import { Request, Response } from 'express';
import IRequest from '../../interfaces/IRequest';
import sodiumLib from '../../lib/sodiumLib';
import jwt from 'jsonwebtoken';

import AuthRequest from '../../models/AuthRequest';

const identify = async (req: IRequest, res: Response) => {
	return res
		.json({
			message: 'Server Public Identity Keys.',
      keys: {
        jwt: process.env.JWT_PUB,
        auth: process.env.AUTH_PUB,
        vapid: process.env.VAPID_PUB,
      }
		})
		.status(200);
};

export default {
	identify
};
