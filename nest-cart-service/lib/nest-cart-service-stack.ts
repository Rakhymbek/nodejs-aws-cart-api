import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apiGw from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

export class NestCartServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const httpApi = new apiGw.HttpApi(this, 'NestCartServiceHttpApi', {
      corsPreflight: {
        allowHeaders: ['*'],
        allowMethods: [apiGw.CorsHttpMethod.ANY],
        allowOrigins: ['*'],
      },
    });

    const nestCartApiLambda = new NodejsFunction(this, 'nestCartApiLambda', {
      entry: path.join(__dirname, '../../dist/main.js'),
      handler: 'mainHandler',
      runtime: lambda.Runtime.NODEJS_16_X,
      environment: {
        PG_HOST: process.env.PG_HOST as string,
        PG_PORT: process.env.PG_PORT as string,
        PG_DATABASE: process.env.PG_DATABASE as string,
        PG_USERNAME: process.env.PG_USERNAME as string,
        PG_PASSWORD: process.env.PG_PASSWORD as string,
      },
    });

    const nestCartApiLambdaIntegration = new HttpLambdaIntegration(
      'NestCartApiLambdaIntegration',
      nestCartApiLambda,
    );

    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [apiGw.HttpMethod.ANY],
      integration: nestCartApiLambdaIntegration,
    });
  }
}
