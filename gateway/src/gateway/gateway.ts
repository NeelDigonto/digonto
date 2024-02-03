import Fastify, { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';

export class Gateway {
  server: FastifyInstance;

  constructor() {
    this.server = Fastify({
      logger: false,
    });

    this.registerRoutes();
  }

  registerRoutes() {
    this.server.post('/web/new-request', async (request, reply) => {
      try {
        /*       const FilterParseRes = FilterV.safeParse(request.body as Filter);
      if (!FilterParseRes.success) {
        reply.status(StatusCodes.BAD_REQUEST).send(FilterParseRes.error.issues);
        return;
      }

      const logs: LogD[] = await find_log(this.pgPool, FilterParseRes.data); */

        return (
          reply
            .status(StatusCodes.OK)
            //.header('Content-Type', 'application/json')
            .send('OK')
        );
      } catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    });
  }

  async run() {
    try {
      await this.server.listen({ port: 4000 });
    } catch (err) {
      this.server.log.error(err);
      process.exit(1);
    }
  }
}
