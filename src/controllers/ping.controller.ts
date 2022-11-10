import {inject} from '@loopback/core';
import {get, Request, response, RestBindings} from '@loopback/rest';
import fs from 'fs';
import path from 'path';
const jsonData = fs.readFileSync(
  path.resolve(__dirname, '..', '..', 'public', 'data', 'data-big.json'),
  'utf-8',
);

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  // Map to `GET /ping`
  @get('/ping')
  @response(200)
  ping(): string {
    // Reply with a greeting, the current time, the url, and request headers
    return jsonData;
  }
}
