import { reportsRoutes } from './src/reports/reports.routes.js';
import { server } from './src/server.js';

const PORT = process.env.PORT || 3456;

server.register(reportsRoutes, { prefix: '/reports' });

try {
  await server.listen({port: PORT});
} catch (err) {
  server.log.error(err);
  process.exit(1);
}