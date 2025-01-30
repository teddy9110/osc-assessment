import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || '04c70d9b6b6d864b3dd17a8fe65104cea04a91dc851c68e179b0a97e4090c783d692df465bb9b57fb61a189d3ffddf0e7c62b4884b3da4d061ea414e6fcd3285',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'pass',
    name: process.env.DB_NAME || 'osc_assessment'
  }
};
