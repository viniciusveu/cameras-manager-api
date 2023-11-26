import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CamerasModule } from './cameras/cameras.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsModule } from './alerts/alerts.module';
import { CustomersModule } from './customers/customers.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: +process.env.MYSQL_PORT || 3306,
      host: process.env.MYSQL_HOST || 'db',
      username: process.env.MYSQL_USER || 'dbuser',
      password: process.env.MYSQL_PASSWORD || 'dbpassword',
      database: process.env.MYSQL_DATABASE || 'mydb',
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      migrations: [`${__dirname}/migrations/*{.ts,.js}`],
      migrationsRun: true,
    }),
    AuthModule,
    CamerasModule,
    AlertsModule, 
    CustomersModule, 
    UsersModule
  ]
})
export class AppModule { }
