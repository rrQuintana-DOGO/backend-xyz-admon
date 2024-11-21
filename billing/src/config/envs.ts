import 'dotenv/config';
import * as Joi from 'joi';

interface EnvConfig {
  NATS_SERVERS: string[];
  STRIPE_SECRET_KEY: string;
  TRIPS_MODULE_ID: string;
  ALERTS_MODULE_ID: string;
  UNITS_MODULE_ID: string;
  TEMPERATURES_MODULE_ID: string;
  FUELS_MODULE_ID: string;
  MAINTENANCES_MODULE_ID: string;
  TAX_RATE_ID: string;
  STRIPE_PORTAL_RETURN_URL: string;
}

const envSchema = Joi.object({
  STRIPE_SECRET_KEY: Joi.string().required(), 
  NATS_SERVERS: Joi.array().items(Joi.string()).required(),
  TRIPS_MODULE_ID: Joi.string().required(),
  ALERTS_MODULE_ID: Joi.string().required(),
  UNITS_MODULE_ID: Joi.string().required(),
  TEMPERATURES_MODULE_ID: Joi.string().required(),
  FUELS_MODULE_ID: Joi.string().required(),
  MAINTENANCES_MODULE_ID: Joi.string().required(),
  TAX_RATE_ID: Joi.string().required(),
  STRIPE_PORTAL_RETURN_URL: Joi.string().required(),
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
  stripeSecretKey: envConfig.STRIPE_SECRET_KEY,
  natsServers: envConfig.NATS_SERVERS,
  tripsModuleId: envConfig.TRIPS_MODULE_ID,
  alertsModuleId: envConfig.ALERTS_MODULE_ID,
  unitsModuleId: envConfig.UNITS_MODULE_ID,
  temperaturesModuleId: envConfig.TEMPERATURES_MODULE_ID,
  fuelsModuleId: envConfig.FUELS_MODULE_ID,
  maintenancesModuleId: envConfig.MAINTENANCES_MODULE_ID,
  taxRateId: envConfig.TAX_RATE_ID,
  stripePortalReturnUrl: envConfig.STRIPE_PORTAL_RETURN_URL,
};
