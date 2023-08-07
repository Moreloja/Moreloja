import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const mongoConfiguration = registerAs('mongo', () => {
  return {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017',
    // TODO Use moreloja as db default?
    dbName: process.env.MONGO_DB_NAME || 'webhooks',
  };
});

export type MongoConfiguration = ConfigType<typeof mongoConfiguration>;

export const InjectMongoConfig = () => Inject(mongoConfiguration.KEY);
