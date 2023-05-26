import { Request, Response } from 'express';
import IRequest from '../../interfaces/IRequest';

import PushSubscription from '../../models/PushSubscription';

const subscribe = async (req: IRequest, res: Response) => {
  await PushSubscription.deleteMany({ publicKey: req.userPubKey });

  await PushSubscription.create({
    publicKey: req.userPubKey, 
    endpoint: req.body.endpoint,
    expirationTime: req.body.expirationTime || 0,
    keys: {
      p256dh: req.body.keys.p256dh,
      auth: req.body.keys.auth
    }
  });

  res
		.json({
			message: 'Subscribed to push notifications.'
		})
		.status(200);
};

const unsubscribe = async (req: IRequest, res: Response) => {
  await PushSubscription.deleteMany({ publicKey: req.userPubKey });

  res
		.json({
			message: 'Unsubscribed to push notifications.'
		})
		.status(200);
};

export default {
  subscribe,
  unsubscribe
}