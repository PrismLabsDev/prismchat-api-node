import { Request, Response } from 'express';
import IRequest from '../../interfaces/IRequest';
import webPush from 'web-push';
import {log} from '../../utility/log';
import {validate} from '../../utility/requestValidator';

import Message from '../../models/Message';
import PushSubscription from '../../models/PushSubscription';

const send = async (req: IRequest, res: Response) => {
  const validationError = validate(req, res, ['to', 'data']);
  if(validationError){
    return res.status(422).json(validationError);
  }
  
  try {
    await Message.create({ recipient: req.body.to, message: req.body.data });
    const pushSubscription = await PushSubscription.findOne({publicKey: req.body.to});

    if(pushSubscription){
      await webPush.sendNotification (
        pushSubscription,
        JSON.stringify ({
          type: 'M'
        }),
        {
          vapidDetails: {
            subject: 'mailto:myemail@example.com',
            publicKey: process.env.VAPID_PUB || '',
            privateKey: process.env.VAPID_PRV || '',
          },
        }
      );
    }
  
    res.status(200).json({
      message: 'Message sent.',
    });
  } catch (error) {
    console.error(error);
    log({
      error: error
    });
    return res.status(500).json({
			message: 'Server error.',
		});
  }
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
    log({
      error: error
    });
    return res.status(500).json({
			message: 'Server error.',
		});
  }  
};

export default {
	receive,
  send
};
