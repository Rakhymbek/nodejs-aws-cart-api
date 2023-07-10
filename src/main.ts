import * as express from 'express';
import * as serverless from 'aws-serverless-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { Context } from 'aws-lambda';
import { AppModule } from './app.module';

let cachedServer;

async function bootstrapServer(): Promise<express.Express> {
  if (!cachedServer) {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const app = await NestFactory.create(AppModule, adapter);
    await app.enableCors();
    await app.init();
    cachedServer = serverless.createServer(expressApp);
  }
  return cachedServer;
}

export const mainHandler = async (event, context: Context) => {
  console.log('Received event:', event);
  console.log('Received context:', context);
  cachedServer = await bootstrapServer();
  return serverless.proxy(cachedServer, event, context, 'PROMISE').promise;
};
