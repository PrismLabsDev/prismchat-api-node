import { Request, Response } from 'express';
import IRequest from '../../interfaces/IRequest';
import {log} from '../../utility/log';
import {validate} from '../../utility/requestValidator';

import PushSubscription from '../../models/PushSubscription';

const subscribe = async (req: IRequest, res: Response) => {
  const validationError = validate(req, res, ['endpoint', 'keys']);
  if(validationError){
    return res.status(422).json(validationError);
  }
  
  try {
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
  
    res.status(200).json({
      message: 'Subscribed to push notifications.'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
			message: 'Server error.',
		});
  }
};

const unsubscribe = async (req: IRequest, res: Response) => {
  try {
    await PushSubscription.deleteMany({ publicKey: req.userPubKey });

    res.status(200).json({
      message: 'Unsubscribed to push notifications.'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
			message: 'Server error.',
		});
  }
};

export default {
  subscribe,
  unsubscribe
}