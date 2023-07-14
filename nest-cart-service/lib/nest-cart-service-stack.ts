import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apiGw from 'aws-cdk-lib/aws-apigateway';
import * as dotenv from 'dotenv';
dotenv.config();

export class NestCartServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const nestCartApiLambda = new NodejsFunction(this, 'nestCartApiLambda', {
      entry: 'dist/src/main.js',
      handler: 'handler',
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        PG_HOST: process.env.PG_HOST as string,
        PG_PORT: process.env.PG_PORT as string,
        PG_DATABASE: process.env.PG_DATABASE as string,
        PG_USERNAME: process.env.PG_USERNAME as string,
        PG_PASSWORD: process.env.PG_PASSWORD as string,
      },
      bundling: {
        minify: true,
        externalModules: [
          'aws-sdk',
          'pg-native',
          'mysql',
          'sqlite3',
          'tedious',
          'better-sqlite3',
          'mysql2',
          'pg-query-stream',
          'oracledb',
          'class-validator',
          'class-transformer',
          '@nestjs/websockets/socket-module',
          '@nestjs/microservices/microservices-module',
          '@nestjs/microservices',
        ],
      },
    });

    const restApi = new apiGw.LambdaRestApi(this, 'NestCartServiceRestApi', {
      handler: nestCartApiLambda,
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: restApi.url ?? '',
    });
  }
}
