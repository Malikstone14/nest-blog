import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import {localData} from "./middlewares/localData"
import MySQLStore, * as mySqlSession from "express-mysql-session"
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setViewEngine('ejs')
  app.setBaseViewsDir(join(__dirname, "..", "views"))
  app.useStaticAssets(join(__dirname, "..", "public"))
  app.useGlobalPipes(new ValidationPipe)

  const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'blog'
  };
  const MySQLStore = mySqlSession(session)
  const store = new MySQLStore(options)
  // somewhere in your initialization file
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      store : store,
    }),
  );
    app.use(localData);
  await app.listen(3000);
}
bootstrap();
