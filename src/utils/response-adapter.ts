import {Http2ServerResponse} from 'http2';

// TEMPORARY (will need a fully refactored object to make it work for all edge cases)
export const responseAdapter = (http2Response: Http2ServerResponse) => {
  return {
    setHeader(name: string, value: string) {
      http2Response.setHeader(name, value);
    },
    end(chunk?: Buffer, encoding?: BufferEncoding, cb?: () => void) {
      console.log('end called chunk:', chunk);
      if (typeof chunk === 'function') {
        cb = chunk;
      }
      http2Response.end(cb);
      return this;
    },
    send(body: string | object) {
      if (typeof body === 'object') {
        body = JSON.stringify(body);
      }
      if (body === undefined) {
        this.end();
        return;
      }
      http2Response.write(body);
      http2Response.end();
    },
  };
};
