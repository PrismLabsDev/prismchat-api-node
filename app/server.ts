import express, { Application } from 'express';
import address from 'address';
import dotenv from 'dotenv';

dotenv.config();

// Global middleware
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import BlacklistMiddleware from './middleware/BlacklistMiddleware';
import WhitelistMiddleware from './middleware/WhitelistMiddleware';

// Routes
import routesAPI from './routes/api';

// Config
import corsConfig from './config/cors';
import rateLimitConfig from './config/rateLimit';
import ipAccessControlConfig from './config/ipAccessControl';

const port = process.env.PORT;
const app = express();

// Global Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsConfig));
app.use(rateLimit(rateLimitConfig));

if(ipAccessControlConfig.mode == 'whitelist'){
  app.use(WhitelistMiddleware(ipAccessControlConfig.ips));
} else {
  app.use(BlacklistMiddleware(ipAccessControlConfig.ips));
}

// Routes
app.use('/', routesAPI);

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
