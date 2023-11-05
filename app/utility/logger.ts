import pino from 'pino';
const pinoPretty = require('pino-pretty');

export const logger = pino({}, pino.transport({
  target: 'pino/file',
  options: { destination: `${__dirname}/../../app.log` },
}));