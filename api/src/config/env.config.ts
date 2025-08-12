import { config } from 'dotenv';
config();

export const env = {
  port: process.env.PORT,
  jwt: {
    accessSecret: process.env.accessSecret,
    refreshSecret: process.env.refreshSecret,
    accessExpire: process.env.accessExpire,
    refreshExpire: process.env.refreshExpire,
  },
};
