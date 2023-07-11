import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    KnexModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          client: 'pg',
          connection: {
            host: configService.get('PG_HOST'),
            user: configService.get('PG_USERNAME'),
            password: configService.get('PG_PASSWORD'),
            database: configService.get('PG_DATABASE'),
            port: Number(configService.get('PG_PORT')),
          },
        },
      }),
    }),
  ],
  exports: [KnexModule],
})
export class DatabaseModule {}
