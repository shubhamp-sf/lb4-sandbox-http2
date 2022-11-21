import * as dotEnv from 'dotenv';
import {ApplicationConfig, DefaultAppApplication} from './application';
export * from './application';

import fs from 'fs';
import path from 'path';
import spdy from 'spdy';

export async function main(options: ApplicationConfig = {}) {
  // create http2 server
  const spdyOptions: spdy.ServerOptions = {
    key: fs.readFileSync(
      path.join(__dirname, '..', 'keys', 'localhost-privkey.pem'),
    ),
    cert: fs.readFileSync(
      path.join(__dirname, '..', 'keys', 'localhost-cert.pem'),
    ),
  };

  options.rest.listenOnStart = false;

  const app = new DefaultAppApplication(options);
  await app.boot();
  await app.start();

  const server = spdy.createServer(spdyOptions, app.requestHandler);

  server.on('warning', warn => {
    console.log(warn);
  });

  server.listen(8443, () => {
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
