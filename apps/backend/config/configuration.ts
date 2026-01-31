export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT!, 10) || 3000,
  databaseURL: process.env.DATABASE_URL,
  digiflazz: {
    username: process.env.DIGIFLAZZ_API_USERNAME,
    apiKey: process.env.DIGIFLAZZ_API_KEY,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT!, 10) || 6379,
  },
});
