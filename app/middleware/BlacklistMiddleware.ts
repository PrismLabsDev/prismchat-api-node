import {Request, Response, NextFunction} from 'express';
import IRequest from '../interfaces/IRequest';

const BlacklistMiddleware = (blacklist: string[]) => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    if (blacklist.includes(req.ip)) {
      res.status(403).send('Access Denied');
    }
    next();
  };
}

export default BlacklistMiddleware;