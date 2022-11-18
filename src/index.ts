import * as dotEnv from 'dotenv';
import {ApplicationConfig, DefaultAppApplication} from './application';
export * from './application';

import {Response} from '@loopback/rest';
import fs from 'fs';
import http2 from 'http2';
import path from 'path';
import {requestAdapter} from './utils/request-adapter';
import {responseAdapter} from './utils/response-adapter';

export async function main(options: ApplicationConfig = {}) {
  // create http2 server
  const h2Server = http2.createSecureServer({
    key: fs.readFileSync(
      path.join(__dirname, '..', 'keys', 'localhost-privkey.pem'),
    ),
    cert: fs.readFileSync(
      path.join(__dirname, '..', 'keys', 'localhost-cert.pem'),
    ),
  });

  options.rest.listenOnStart = false;

  const app = new DefaultAppApplication(options);
  await app.boot();
  await app.start();

  h2Server.on('request', (req, res) => {
    console.log('on request');
    console.log('HTTP2 Requested ->', req.headers[':path']);

    let body = '';
    const handleData = (chunk: Buffer | string) => {
      body += chunk;
      // TODO: handle large chunk size
    };
    const handleEnd = (err: Error) => {
      app.requestHandler(
        requestAdapter(req, body),
        responseAdapter(res) as Response,
      );
      if (err !== undefined) {
        res.statusCode = 400;
        res.write('Error' + err.message || err.toString());
        res.end();
        return;
      }
    };

    req.stream.addListener('data', handleData);
    req.stream.addListener('end', handleEnd);
    req.stream.addListener('error', handleEnd);
  });

  /* h2Server.on('stream', (stream, requestHeaders) => {
    console.log('on stream');
    stream.respond({
      ':status': 200,
      'content-type': 'text/plain',
    });

    stream.on('data', chunk => {
      console.log('Received data: ', chunk.toString());
      // stream.write(data); // echo received data back
    });

    stream.on('close', () => {
      console.log('stream closed');
    });

    stream.on('end', () => {
      console.log('stream end');
    });
  }); */

  h2Server.listen({port: 8443}, () => {
    console.log('Listening on https://localhost:8443/');
  });

  return app;
}

if (require.main === module) {
  dotEnv.config();
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
