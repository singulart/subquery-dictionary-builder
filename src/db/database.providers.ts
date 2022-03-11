import { Sequelize } from 'sequelize-typescript'
import url from 'url';
import { Logger } from '@nestjs/common';
import { appConfig } from '../config';
import { SpecVersion } from './specversion.entity';
import { Extrinsic } from './extrinsic.entity';
import { Event } from './event.entity';

const logger = new Logger('DB');
const dbName = appConfig.database;
const dbUrl = process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`;

const dbConfig = parseConnectionString(dbUrl);
logger.log(JSON.stringify(dbConfig));

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        database: dbConfig.database,
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password
      });
      sequelize.addModels([SpecVersion, Event, Extrinsic]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

function parseConnectionString(connectionString: string): any {

  let config: any = {};
  let options: any = {}

  const urlParts = url.parse(connectionString);

  options.dialect = urlParts.protocol?.replace(/:$/, '');
  options.host = urlParts.hostname;

  if (urlParts.pathname) {
    config.database = urlParts.pathname.replace(/^\//, '');
  }

  if (urlParts.port) {
    options.port = urlParts.port;
  }

  if (urlParts.auth) {
    const authParts = urlParts.auth.split(':');

    config.username = authParts[0];

    if (authParts.length > 1)
      config.password = authParts.slice(1).join(':');
  }

  let result = Object.assign({}, config, options);

  return result;
}