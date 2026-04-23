import dotenv  from 'dotenv';

dotenv.config();

export const envVars = {


 PORT: process.env.PORT || 1200,
 MONGO_URI:process.env.MONGO_URI,
 NODE_ENV: process.env.NODE_ENV,
 JWT_SECRET: process.env.JWT_SECRET,
 SMTP_EMAIL: process.env.SMTP_EMAIL,
 SMTP_PASSWORD: process.env.SMTP_PASSWORD,
 };