import { StatusCodes } from 'http-status-codes';
import { initORM } from '@/db/db';
import { MikroORM } from '@mikro-orm/postgresql';
import { webRequestAPISchema } from '@/modules/WebRequest/WebRequest.schema';
import { createWebRequest } from '@/modules/WebRequest/WebRequest';
import Fastify, { FastifyInstance } from 'fastify';

export class Gateway {
  fastifyServer: FastifyInstance;
  orm!: MikroORM;

  constructor() {
    this.fastifyServer = Fastify({
      logger: {
        level: 'info',
      },
    });

    this.registerRoutes();
  }

  registerRoutes() {
    this.fastifyServer.get('/health', async (request, reply) => {
      reply.status(StatusCodes.OK).send('OK');
    });

    this.fastifyServer.post('/web/new-request', async (request, reply) => {
      try {
        const bodyParseRes = webRequestAPISchema.safeParse(request.body);

        if (!bodyParseRes.success) {
          console.warn(bodyParseRes.error.issues);
          reply.status(StatusCodes.BAD_REQUEST).send(bodyParseRes.error.issues);
          return;
        }

        const em = this.orm.em.fork();

        await createWebRequest(em, bodyParseRes.data);

        reply.status(StatusCodes.OK).send('OK');
      } catch (error) {
        console.error(error);
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    });
  }

  async run() {
    try {
      this.orm = await initORM();

      if (await this.orm.migrator.checkMigrationNeeded()) {
        await this.orm.migrator.up();
      }

      await this.fastifyServer.listen({ port: 4000, host: '0.0.0.0' });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}
