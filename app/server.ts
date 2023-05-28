import express, { Application } from 'express';
import address from 'address';
import dotenv from 'dotenv';

dotenv.config();

// Global middleware
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit'

// Routes
import routesAPIV1 from './routes/api';

// Config
import corsConfig from './config/cors';
import rateLimitConfig from './config/rateLimit';

const port = process.env.PORT;
const app = express();

// Global Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsConfig));
// app.use(rateLimit(rateLimitConfig))

// Routes
app.use('/api/v1', routesAPIV1);

const listen = async (setup: any) => {
  await setup();
  
	app.listen(port, () => {
		console.log(`Server started on port ${port}`);
    console.log(`Available on your local computer at http://localhost:${port}`);
		console.log(`Available on your local network at http://${address.ip()}:${port}`);
	});
};

export default {
	app,
	listen,
};
