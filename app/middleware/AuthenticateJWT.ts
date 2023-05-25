import {Request, Response, NextFunction} from 'express';
import IRequest from '../interfaces/IRequest';
import jwt from 'jsonwebtoken'

const AuthenticateJWT = (req: IRequest, res: Response, next: NextFunction) => {
  
  const authHeader = req.get("Authorization")

  if(!authHeader){
    return res.json({
			message: 'You are not authenticated.',
		})
		.status(401);
  }

  const token = authHeader.split(" ")[1];
  const decoded: any = jwt.verify(token, process.env.JWT_PRV || '');

  if(!decoded){
    return res.json({
			message: 'You are not authenticated.',
		})
		.status(401);
  }

  if(!decoded.aud){
    return res.json({
			message: 'You are not authenticated.',
		})
		.status(401);
  }

  req.userPubKey = decoded?.aud;


  next();
}

export default AuthenticateJWT;