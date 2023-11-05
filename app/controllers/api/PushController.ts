import { Request, Response } from 'express';
import IRequest from '../../interfaces/IRequest';
import Joi from 'joi';
import { logger } from '../../utility/logger';

import PushSubscription from '../../models/PushSubscription';

const subscribe = async (req: IRequest, res: Response) => {
  try {
    await Joi.object({
      endpoint: Joi.string().required(),
      keys: Joi.any().required(),
      expirationTime: Joi.any().required(),
    }).validateAsync(req.body);
  } catch(error) {
    return res.status(422).json({
      message: 'Missing entity',
      error: error
    });
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
    logger.error(error);
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
    logger.error(error);
    return res.status(500).json({
			message: 'Server error.',
		});
  }
};

export default {
  subscribe,
  unsubscribe
}