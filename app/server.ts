import express, { Application } from 'express';
import address from 'address';
import dotenv from 'dotenv';

dotenv.config();

import routes from './routes';
import bodyParser from 'body-parser';
import cors from 'cors';

// Config
import CorsConfig from './config/cors';

const port = process.env.PORT;
const app = express();

// Global Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(CorsConfig));

// Routes
app.use('/api/v1', routes);

const listen = async (cb: any) => {
  await cb();
  
	app.listen(port, () => {
		console.log(`Server started on port ${port}`);
		console.log(`Available on your local network at ${address.ip()}:${port}`);
	});
};

export default {
	app,
	listen,
};
