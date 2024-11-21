import 'dotenv/config';
import * as Joi from 'joi';

interface EnvConfig {
  NATS_SERVERS: string;
  DATABASE_URL_POSTGRES: string;
  SECRET_KEY_TOKEN: string;
  CRYPT_KEY: string;
  XYZ_CLIENT_GATEWAY_URL: string
}

const envSchema = Joi.object({
  DATABASE_URL_POSTGRES: Joi.string().required(),
  NATS_SERVERS: Joi.array().items(Joi.string()).required(),
  SECRET_KEY_TOKEN: Joi.string().required(),
  CRYPT_KEY: Joi.string().required(),
  XYZ_CLIENT_GATEWAY_URL: Joi.string().uri().required()
}).unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(',')
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envConfig: EnvConfig = value;

export const envs = {
  database_url_postgres: envConfig.DATABASE_URL_POSTGRES,
  natsServers : envConfig.NATS_SERVERS,
  secret_key_token: envConfig.SECRET_KEY_TOKEN,
  crypt_key: envConfig.CRYPT_KEY,
  xyz_client_gateway_url: envConfig.XYZ_CLIENT_GATEWAY_URL
};
