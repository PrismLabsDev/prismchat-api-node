import { Request } from 'express';

interface IRequest extends Request {
  userPubKey?: string
}

export default IRequest;