import Fastify from 'fastify';
import cors from '@fastify/cors';

export const server = Fastify({
  logger: {
    // file: './logs/server.log',
    enabled: true,
  }
});

server.addHook('preHandler', async (request, reply) => {
  if (request.body) {
    request.log.info({ body: request.body }, 'Request body')
  }
});

export const logger = server.log;

server.register(cors, {
  origin: '*'
});