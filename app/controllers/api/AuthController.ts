import { Request, Response } from 'express';
import IRequest from '../../interfaces/IRequest';
import sodiumLib from '../../utility/sodiumLib';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { logger } from '../../utility/logger';

import AuthRequest from '../../models/AuthRequest';

import allowedPublicKeys from '../../config/allowedPublicKeys';

const randomString = (min: number = 50, max: number = 60): string => {
  const length = Math.floor(Math.random() * (max - min + 1) + min);
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*';
  let randomString = '';

  [...Array(length)].forEach((_) => {
    randomString = randomString + characters[Math.floor(Math.random() * characters.length)];
  });

  return randomString;
}

const pubkey = async (req: IRequest, res: Response) => {
  try {
    return res.status(200).json({
			message: 'Server Public Key.',
      auth_pubkey: process.env.AUTH_PUB,
      jwt_pubkey: process.env.JWT_PUB  
		});
  } catch (error) {
    console.error(error);
    logger.error(error);
    return res.status(500).json({
			message: 'Server error.',
		});
  }
};

const request = async (req: IRequest, res: Response) => {
  try {
    await Joi.object({
      Ipk: Joi.string().required()
    }).validateAsync(req.body);
  } catch(error) {
    return res.status(422).json({
      message: 'Missing entity',
      error: error
    });
  }

  const allowedPublicKeysData: string[] = allowedPublicKeys;

  if(allowedPublicKeysData.length > 0){
    if(!allowedPublicKeysData.includes(req.body.Ipk)){
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }
  }

  try {
    // Remove all existing verifications that match requesting pubkey
    await AuthRequest.deleteMany({publicKey: req.body.Ipk});
      
    // Generate new verification string
    const verificationString = randomString();

    // Create new request record
    await AuthRequest.create({ publicKey: req.body.Ipk, verificationString: verificationString });

    return res.status(200).json({
      message: 'Requesting Authentication.',
      serverPublicKey: process.env.AUTH_PUB,
      verificationString: verificationString
    });
  } catch (error) {
    console.error(error);
    logger.error(error);
    return res.status(500).json({
			message: 'Server error.'
		});
  }
};

const verify = async (req: IRequest, res: Response) => {
  try {
    await Joi.object({
      cipher: Joi.string().required(),
      nonce: Joi.string().required(),
      Ipk: Joi.string().required()
    }).validateAsync(req.body);
  } catch(error) {
    return res.status(422).json({
      message: 'Missing entity',
      error: error
    });
  }

  try {

    const sodium = await sodiumLib.init();

    const publicKeyAuth = sodium.from_base64(process.env.AUTH_PUB || '', sodium.base64_variants.URLSAFE_NO_PADDING);
    const privateKeyAuth = sodium.from_base64(process.env.AUTH_PRV || '', sodium.base64_variants.URLSAFE_NO_PADDING);
  
    const verificationRecord = await AuthRequest.findOne({ publicKey: req.body.Ipk }).sort({ createdAt: -1 }).exec();
    await AuthRequest.deleteMany({ publicKey: req.body.Ipk });

    const decryptedCypher = JSON.parse(
      sodium.to_string(
        sodium.crypto_box_open_easy(
          sodium.from_base64(
            req.body.cipher,
            sodium.base64_variants.URLSAFE_NO_PADDING
          ),
          sodium.from_base64(
            req.body.nonce,
            sodium.base64_variants.URLSAFE_NO_PADDING
          ),
          sodium.from_base64(
            verificationRecord?.publicKey || '',
            sodium.base64_variants.URLSAFE_NO_PADDING
          ),
          privateKeyAuth
        )
      )
    );
  
    if(decryptedCypher.verificationString === verificationRecord?.verificationString){
  
      const token = jwt.sign({
        data: {}
      }, process.env.JWT_PRV || '', { 
        issuer: "prism.chat", 
        audience: verificationRecord?.publicKey, 
        expiresIn: '24h' 
      });
  
      return res.status(200).json({
        message: 'Authentication Verified.',
        access_token: token
      });
    } else {
      return res.status(401).json({
        message: 'Verification string does not match.',
      });
    }
  } catch (error) {
    console.error(error);
    logger.error(error);
    return res.status(500).json({
			message: 'Server error.',
		});
  }  
};

export default {
	pubkey,
  request,
  verify
};
