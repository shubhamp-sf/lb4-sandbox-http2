import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {OperationRetval, Request, Response, RestBindings} from '@loopback/rest';

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
    // console.log('Result', response, result);
    console.log(result);
    response.send(result);
  }
}
