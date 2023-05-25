import { Request, Response } from 'express';
import IRequest from '../interfaces/IRequest';

import Message from '../models/Message';

const send = async (req: IRequest, res: Response) => {

  await Message.create({ recipient: req.body.to, message: req.body.data });

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
