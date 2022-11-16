import {/* inject, */ BindingScope, injectable, Provider} from '@loopback/core';
import {HandlerContext} from '@loopback/rest';

/*
 * Fix the service type. Possible options can be:
 * - import {Http2Reject} from 'your-module';
 * - export type Http2Reject = string;
 * - export interface Http2Reject {}
 */
export type Http2Reject = unknown;

@injectable({scope: BindingScope.TRANSIENT})
export class Http2RejectProvider implements Provider<Http2Reject> {
  constructor(/* Add @inject to inject parameters */) {}

  value() {
    return (ctx: HandlerContext, err: Error) => {
      console.log('reject provider', err);
    };
  }
}
