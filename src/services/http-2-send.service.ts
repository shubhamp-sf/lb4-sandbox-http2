import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {OperationRetval, Request, Response, RestBindings} from '@loopback/rest';
import debugFactory from 'debug';

const debug = debugFactory('http2:send:provider');
/*
 * Fix the service type. Possible options can be:
 * - import {Http2Send} from 'your-module';
 * - export type Http2Send = string;
 * - export interface Http2Send {}
 */
export type Http2Send = unknown;

@injectable({scope: BindingScope.TRANSIENT})
export class Http2SendProvider implements Provider<Http2Send> {
  constructor(@inject(RestBindings.Http.REQUEST) public request: Request) {}

  value() {
    return (response: Response, result: OperationRetval) => {
      this.action(response, result);
    };
  }

  action(response: Response, result: OperationRetval) {
    if (result === response || response.headersSent) {
      debug('✅ result === response || response.headersSent');
      return;
    }
    if (result === undefined) {
      // response.send(Reflect.ownKeys(response));
      response.end();
    } else {
      response.send(result);
    }

    /*

    debug('response.headersSent: ', response.headersSent);

    if (result === undefined) {
      // response.send(Reflect.ownKeys(response));
      response.end();
    } else {
      debug('Result', result);
      // response.send(response || result);
    } */
  }
}
