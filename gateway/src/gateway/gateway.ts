import { StatusCodes } from 'http-status-codes';
import express, { Express, NextFunction, Request, Response } from 'express';
import { WebRequestVT, webRequestV } from '@/schema';
import { Services, initORM } from '@/db/db';
import { WebRequest } from '@/modules/WebRequest/WebRequest.entity';
import { RequestContext } from '@mikro-orm/postgresql';

export class Gateway {
  expressServer: Express;
  orm!: Services;

  constructor() {
    this.expressServer = express();
    this.expressServer.use(express.json());
    this.expressServer.use(
      (request: Request, reply: Response, next: NextFunction) => {
        RequestContext.create(this.orm.em, next);
      },
    );

    this.registerRoutes();
  }

  registerRoutes() {
    this.expressServer.post(
      '/web/new-request',
      async (request: Request, reply: Response) => {
        try {
          const bodyParseRes = webRequestV.safeParse(request.body);

          if (!bodyParseRes.success) {
            console.warn(bodyParseRes.error.issues);
            reply
              .status(StatusCodes.BAD_REQUEST)
              .send(bodyParseRes.error.issues);
            return;
          }

          const webRequest = new WebRequest();
          webRequest.route = bodyParseRes.data.route;
          webRequest.requestMetadata = {
            headerKVs: bodyParseRes.data.headerKVs,
            cookieNVs: bodyParseRes.data.cookieNVs,
          };

          await this.orm.em.persistAndFlush(webRequest);

          reply.status(StatusCodes.OK).send('OK');
        } catch (error) {
          console.error(error);
          reply.status(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      },
    );
  }

  async run() {
    this.orm = await initORM();

    if (process.env.NODE_ENV === 'dev') {
      await this.orm.orm.schema.updateSchema();
    }

    try {
      await this.expressServer.listen(4000, '0.0.0.0', () => {
        console.log('Listening on Port: 4000');
      });
    } catch (err) {
      process.exit(1);
    }
  }
}
