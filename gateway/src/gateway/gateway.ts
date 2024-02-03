import { StatusCodes } from 'http-status-codes';
import express, { Express, Request, Response } from 'express';

export class Gateway {
  expressServer: Express;

  constructor() {
    this.expressServer = express();

    this.registerRoutes();
  }

  registerRoutes() {
    this.expressServer.get('/', async (request, reply) => {
      reply.status(200).send('OK');
    });

    this.expressServer.post('/web/new-request', async (request, reply) => {
      try {
        /*       const FilterParseRes = FilterV.safeParse(request.body as Filter);
      if (!FilterParseRes.success) {
        reply.status(StatusCodes.BAD_REQUEST).send(FilterParseRes.error.issues);
        return;
      }

      const logs: LogD[] = await find_log(this.pgPool, FilterParseRes.data); */

        reply
          .status(StatusCodes.OK)
          //.header('Content-Type', 'application/json')
          .send('OK');
      } catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    });
  }

  async run() {
    try {
      await this.expressServer.listen(4000, '0.0.0.0', () => {
        console.log('Listening on Port: 4000');
      });
    } catch (err) {
      process.exit(1);
    }
  }
}
