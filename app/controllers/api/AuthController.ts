import { Request, Response } from 'express';
import IRequest from '../../interfaces/IRequest';
import sodiumLib from '../../lib/sodiumLib';
import jwt from 'jsonwebtoken';

import AuthRequest from '../../models/AuthRequest';

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
	return res
		.json({
			message: 'Server Public Key.',
      auth_pubkey: process.env.AUTH_PUB,
      jwt_pubkey: process.env.JWT_PUB  
		})
		.status(200);
};

const request = async (req: IRequest, res: Response) => {
  // Remove all existing verifications that match requesting pubkey
  await AuthRequest.deleteMany({publicKey: req.body.pubkey});
  
  // Generate new verification string
  const verificationString = randomString();

  // Create new request record
  await AuthRequest.create({ publicKey: req.body.pubkey, verificationString: verificationString });
	return res
		.json({
			message: 'Requesting Authentication.',
      serverPublicKey: process.env.AUTH_PUB,
      verificationString: verificationString
		})
		.status(200);
};

const verify = async (req: IRequest, res: Response) => {

  const sodium = await sodiumLib.init();

  const publicKeyAuth = sodium.from_base64(process.env.AUTH_PUB || '', sodium.base64_variants.URLSAFE_NO_PADDING);
  const privateKeyAuth = sodium.from_base64(process.env.AUTH_PRV || '', sodium.base64_variants.URLSAFE_NO_PADDING);

  const verificationRecord = await AuthRequest.findOne({publicKey: req.body.pubkey});

  console.log(req.body);
  console.log(verificationRecord);

  try {
    const decryptedCypher = JSON.parse(
      sodium.to_string(
        sodium.crypto_box_open_easy(
          sodium.from_base64(
            req.body.cypher,
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
  
      await AuthRequest.deleteMany({publicKey: req.body.pubkey});
  
      return res
      .json({
        message: 'Authentication Verified.',
        access_token: token
      })
      .status(200);
    } else {
      await AuthRequest.deleteMany({publicKey: req.body.pubkey});
      return res
      .json({
        message: 'Verification string does not match.',
      })
      .status(401);
    }
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({
        message: 'You could not be verified',
      });
      
  }

  
};

export default {
	pubkey,
  request,
  verify
};
