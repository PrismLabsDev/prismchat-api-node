import { Request, Response } from 'express';
import IRequest from '../../interfaces/IRequest';
import { logger } from '../../utility/logger';

/**
 * @swagger
 * tags:
 *   name: Identify
 *   description: Identofy server public keys.
*/

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get public keys used by server to verify token authenticity.
 *     tags: [Identify]
 *     responses:
 *       200:
 *         description: Successful response data
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Description of opperation.
 *             keys:
 *               type: object
 *               properties:
 *                 jwt:
 *                   type: string
 *                   description: Public key used to verify JWT signature.
 *                 auth:
 *                   type: string
 *                   description: Public key to verify /auth/request verificationString.
 *                 vapid:
 *                   type: string
 *                   description: Public Key used for vapid token signing for push notifications.
 */

/**
 * @swagger
 * /identify:
 *   get:
 *     summary: Get public keys used by server to verify token authenticity.
 *     tags: [Identify]
 *     responses:
 *       200:
 *         description: Successful response data
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Description of opperation.
 *             keys:
 *               type: object
 *               properties:
 *                 jwt:
 *                   type: string
 *                   description: Public key used to verify JWT signature.
 *                 auth:
 *                   type: string
 *                   description: Public key to verify /auth/request verificationString.
 *                 vapid:
 *                   type: string
 *                   description: Public Key used for vapid token signing for push notifications.
 */
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
    console.error(error);
    logger.error(error);
    return res.status(500).json({
			message: 'Server error.',
		});
  }
};

export default {
	identify
};
