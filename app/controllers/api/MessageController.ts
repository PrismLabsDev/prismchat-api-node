import { Request, Response } from 'express';
import IRequest from '../../interfaces/IRequest';
import webPush from 'web-push';
import Joi from 'joi';

import Message from '../../models/Message';
import PushSubscription from '../../models/PushSubscription';

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

    const VAPID_PUB: string = process.env.VAPID_PUB || '';
    const VAPID_PRV: string = process.env.VAPID_PRV || '';

    if(pushSubscription){
      // console.log(pushSubscription);
      await webPush.sendNotification (
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
    console.error(error);
  }

  return res.status(200).json({
    message: 'Message sent.',
  });
};

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
    return res.status(500).json({
			message: 'Server error.',
		});
  }  
};

export default {
	receive,
  send
};
