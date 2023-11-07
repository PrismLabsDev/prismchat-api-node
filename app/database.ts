import { connect as mongooseConnect, disconnect as mongooseDisconnect } from 'mongoose';

const connectionString = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?authSource=admin`;

const connect = async (connectionString: string) => {
	await mongooseConnect(connectionString);
};

const closeConnection = async () => {
  await mongooseDisconnect();
}

export default {
  connectionString,
  connect,
  closeConnection
}
