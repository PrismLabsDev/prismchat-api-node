import { Request, Response } from 'express';
import IRequest from '../../interfaces/IRequest';
import webPush from 'web-push';
import Joi from 'joi';
import { logger } from '../../utility/logger';

import Message from '../../models/Message';
import PushSubscription from '../../models/PushSubscription';

import allowedPublicKeys from '../../config/allowedPublicKeys';

/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Manage sending and recieveing messages.
*/

/**
 * @swagger
 * /message:
 *   post:
 *     summary: Send a message to a user registered at this server.
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parameter1:
 *                 type: string
 *                 description: kaka
 *     responses:
 *       200:
 *         description: Message confirmation.
 */
const send = async (req: IRequest, res: Response) => {

  try {
    await Joi.object({
      to: Joi.string().required(),
      data: Joi.string().required(),
    }).validateAsync(req.body);
  } catch(error) {
    return res.status(422).json({
      message: 'Missing entity',
      error: error
    });
  }

  const allowedPublicKeysData: string[] = allowedPublicKeys;

  if(allowedPublicKeysData.length > 0){
    if(!allowedPublicKeysData.includes(req.body.to)){
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }
  }
  
  try {
    await Message.create({ recipient: req.body.to, message: req.body.data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
			message: 'Server error.',
		});
  }

  try {
    const pushSubscription = await PushSubscription.findOne({publicKey: req.body.to});

    if(pushSubscription){

      const VAPID_PUB: string = process.env.VAPID_PUB || '';
      const VAPID_PRV: string = process.env.VAPID_PRV || '';

      await webPush.sendNotification(
        pushSubscription,
        JSON.stringify ({
          type: 'M'
        }),
        {
          vapidDetails: {
            subject: `https://${process.env.URL}`,
            publicKey: VAPID_PUB,
            privateKey: VAPID_PRV,
          },
        }
      );
    }
  } catch (error) {
    console.log(error);
    logger.error(error);
  }

  return res.status(200).json({
    message: 'Message sent.',
  });
};

/**
 * @swagger
 * /message:
 *   get:
 *     summary: Get all messages sent to you.
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parameter1:
 *                 type: string
 *                 description: kaka
 *     responses:
 *       200:
 *         description: List of messages.
 */
const receive = async (req: IRequest, res: Response) => {
  try {
    const allMessages = await Message.find({recipient: req.userPubKey}).exec();
    await Message.deleteMany({recipient: req.userPubKey});
  
    res.status(200).json({
      message: 'All messages.',
      messages: allMessages
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
	receive,
  send
};
