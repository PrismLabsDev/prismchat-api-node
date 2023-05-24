import { Request, Response } from 'express';

const index = (req: Request, res: Response): void => {
	res
		.json({
			message: 'Welcome to your TS Web App.',
		})
		.status(200);
};

export default {
	index,
};
