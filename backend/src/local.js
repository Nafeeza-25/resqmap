import { createApiHandler } from './app.js';
import { createRepositoryFromEnv } from './repository/index.js';

const port = Number(process.env.PORT || 8787);
const repository = await createRepositoryFromEnv();
const app = createApiHandler({ repository });

const server = app.listen(port, () => {
  console.log(`ResQMap API ready at http://localhost:${port}/api`);
});

const shutdown = () => server.close(() => process.exit(0));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
