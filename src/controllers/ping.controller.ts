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

  // HTTP2 ✅
  @get('/ping')
  @response(200)
  ping(): string {
    return jsonData;
  }

  // HTTP2 ✅
  @get('/pong')
  @response(200)
  pong() {
    this.res.send('pong');
  }

  // HTTP2 ⌛ (req.body isn't parsed)
  @get('/ding')
  @response(200)
  ding() {
    console.log('this.req.body', this.req.body);
    this.res.send('dong');
  }
}
