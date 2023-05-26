import { Request, Response } from 'express';
import IRequest from '../../interfaces/IRequest';
import webPush from 'web-push';

import Message from '../../models/Message';
import PushSubscription from '../../models/PushSubscription';

const send = async (req: IRequest, res: Response) => {

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

	res
		.json({
			message: 'Message sent.',
		})
		.status(200);
};

const receive = async (req: IRequest, res: Response) => {

  const allMessages = await Message.find({recipient: req.userPubKey}).exec();
  await Message.deleteMany({recipient: req.userPubKey});

	res
		.json({
			message: 'All messages.',
      messages: allMessages
		})
		.status(200);
};

export default {
	receive,
  send
};
