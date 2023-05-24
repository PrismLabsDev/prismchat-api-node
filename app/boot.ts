import server from './server';
import database from './database';

// Models
import AuthRequest from './models/AuthRequest';
import Message from './models/Message';

// Boot function
(async function () {
  // Connect to DB
  const connectionString = database.connectionString;
  await database.connect(connectionString);

  // Run server
  server.listen();
})();

