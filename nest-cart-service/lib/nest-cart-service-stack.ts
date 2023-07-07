import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apiGw from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as path from 'path';

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
      functionName: 'mainHandler',
      runtime: lambda.Runtime.NODEJS_16_X,
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
