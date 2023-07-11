import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { KnexModule } from 'nestjs-knex';

@Module({
  imports: [
    AuthModule,
    CartModule,
    OrderModule,
    KnexModule.forRoot({
      config: {
        client: 'pg',
        connection: {
          host: process.env.PG_HOST as string,
          port: +process.env.PG_PORT as number,
          database: process.env.PG_DATABASE as string,
          user: process.env.PG_USERNAME as string,
          password: process.env.PG_PASSWORD as string,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
