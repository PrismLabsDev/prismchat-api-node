import server from './server';
import database from './database';
import schedule from './schedule';

// Boot function
(async function () {
  // Connect to DB
  const connectionString = database.connectionString;
  await database.connect(connectionString);

  // Run server
  server.listen(async () => {
    schedule.run();
  });
})();

