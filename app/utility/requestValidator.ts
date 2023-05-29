import { Request, Response } from 'express';
import IRequest from '../interfaces/IRequest';

const validate = (req: IRequest, res: Response, required: string[]) => {
  for (const element of required) {
    if(!req.body[element]){
      return {
        message: `Missing required body value.`,
        key: element
      };
    }
  }
  return null;
}

export {
  validate
}