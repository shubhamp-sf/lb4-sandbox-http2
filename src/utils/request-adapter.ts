import {IncomingMessage} from 'http';
import http2 from 'http2';
import {Socket} from 'net';
// const readable = Readable.from(['input string']);

const {HTTP2_HEADER_PATH, HTTP2_HEADER_METHOD} = http2.constants;

// TEMPORARY (will need a fully refactored object to make it work for all edge cases)
export const requestAdapter = (
  http2Request: http2.Http2ServerRequest,
  body: Buffer | string,
): IncomingMessage => {
  const socket = new Socket();

  const http1Req = new IncomingMessage(socket);
  http1Req.method = http2Request.headers[HTTP2_HEADER_METHOD] as string;
  http1Req.url = http2Request.headers[HTTP2_HEADER_PATH] as string;

  return http1Req;
};
