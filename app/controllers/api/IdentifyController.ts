import { Request, Response } from 'express';
import IRequest from '../../interfaces/IRequest';
import {log} from '../../utility/log';
import {validate} from '../../utility/requestValidator';

const identify = async (req: IRequest, res: Response) => {
  try {
    return res.status(200).json({
      message: 'Server Public Identity Keys.',
      keys: {
        jwt: process.env.JWT_PUB,
        auth: process.env.AUTH_PUB,
        vapid: process.env.VAPID_PUB,
      }
    });
  } catch (error) {
    log({
      error: error
    });
    return res.status(500).json({
			message: 'Server error.',
		});
  }
};

export default {
	identify
};
