import server from './server';
import database from './database';

import sodiumLib from './sodium';

// Models
import AuthRequest from './models/AuthRequest';
import Message from './models/Message';
import sodium from './sodium';

// Boot function
(async function () {
  // Connect to DB
  const connectionString = database.connectionString;
  await database.connect(connectionString);

  // Run server
  server.listen(async () => {
    // Runs before listen occurs
  });
})();

