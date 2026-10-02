// src/config/env.js
import "dotenv/config";
import Joi from "joi";

const expiry = Joi.string().pattern(/^\d+[smhd]$/); // e.g. 15m, 7d

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "test", "production")
    .default("development"),

  PORT: Joi.number().port().default(3000),

  MONGO_URI: Joi.string()
    .pattern(/^mongodb(\+srv)?:\/\//)
    .required(),

  ACCESS_TOKEN_SECRET: Joi.string().min(32).required(),
  ACCESS_TOKEN_EXPIRES_IN: expiry.default("15m"),

  // must not be the same value as the access secret
  REFRESH_TOKEN_SECRET: Joi.string()
    .min(32)
    .invalid(Joi.ref("ACCESS_TOKEN_SECRET"))
    .required(),
  REFRESH_TOKEN_EXPIRES_IN: expiry.default("7d"),

  COOKIE_SAME_SITE: Joi.string().valid("lax", "strict", "none").default("lax"),

  COOKIE_SECURE: Joi.boolean()
    // in production the cookie must be Secure
    .when("NODE_ENV", {
      is: "production",
      then: Joi.valid(true).required(),
      otherwise: Joi.any().default(false),
    })
    // SameSite=None is rejected by browsers unless Secure is set
    .when("COOKIE_SAME_SITE", {
      is: "none",
      then: Joi.valid(true).required(),
    }),
}).unknown(true);

const { error, value } = schema.validate(process.env, { abortEarly: false });

if (error) {
  console.error("Invalid environment configuration:");
  error.details.forEach((d) => console.error(`  - ${d.message}`));
  process.exit(1);
}

export const env = Object.freeze({
  nodeEnv: value.NODE_ENV,
  isProduction: value.NODE_ENV === "production",
  port: value.PORT,
  mongoUri: value.MONGO_URI,
  jwt: Object.freeze({
    accessSecret: value.ACCESS_TOKEN_SECRET,
    accessExpiresIn: value.ACCESS_TOKEN_EXPIRES_IN,
    refreshSecret: value.REFRESH_TOKEN_SECRET,
    refreshExpiresIn: value.REFRESH_TOKEN_EXPIRES_IN,
  }),
  cookie: Object.freeze({
    secure: value.COOKIE_SECURE,
    sameSite: value.COOKIE_SAME_SITE,
  }),
});
