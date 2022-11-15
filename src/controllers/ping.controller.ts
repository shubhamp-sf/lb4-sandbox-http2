import {inject} from '@loopback/core';
import {get, Request, Response, response, RestBindings} from '@loopback/rest';
import fs from 'fs';
import path from 'path';
const jsonData = fs.readFileSync(
  path.resolve(__dirname, '..', '..', 'public', 'data', 'data-small.json'),
  'utf-8',
);

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
  ) {}

  // Map to `GET /ping`
  @get('/ping')
  @response(200)
  ping(): string {
    return jsonData;
  }

  @get('/pong')
  @response(200)
  pong() {
    this.res.send('pong');
  }
}
