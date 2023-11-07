import {Request, Response, NextFunction} from 'express';
import IRequest from '../interfaces/IRequest';

const WhitelistMiddleware = (whitelist: string[]) => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    if (!whitelist.includes(req.ip)) {
      res.status(403).send('Access Denied');
    }
    next();
  };
}

export default WhitelistMiddleware;