export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.port || 3002,
  default_limit: process.env.DEFAULT_LIMIT || 3,
});

// export const env = {
//   CONFIG: {
//     // STAGE: process.env.STAGE,
//     MONGO_DB: configService.get<number>('default_limit')
//   },
//   SERVICES: {
//     // INVENTORY: {
//     //   API_URL: process.env.INVENTORY_SERVICES_URL,
//     // },

//   },
//   PAGINATION: {
//     DEFAULT_LIMIT: configService.get<number>('default_limit')
//   }
// } as const
