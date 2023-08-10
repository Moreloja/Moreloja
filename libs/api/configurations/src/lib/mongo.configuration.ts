import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const mongoConfiguration = registerAs('mongo', () => {
  return {
    uri: process.env['MORELOJA_MONGO_URI'] || 'mongodb://localhost:27017',
    dbName: process.env['MORELOJA_MONGO_DB_NAME'] || 'moreloja',
  };
});

export type MongoConfiguration = ConfigType<typeof mongoConfiguration>;

export const InjectMongoConfig = () => Inject(mongoConfiguration.KEY);
