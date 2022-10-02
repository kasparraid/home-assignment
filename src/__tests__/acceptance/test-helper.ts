import {HomeAssignmentApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';

export async function givenRunningApplicationWithCustomConfiguration() {
  const app = new HomeAssignmentApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();
  await app.start();

  return app;
}

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new HomeAssignmentApplication({
    rest: restConfig,
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: HomeAssignmentApplication;
  client: Client;
}
