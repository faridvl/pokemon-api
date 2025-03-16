// env.provider.ts
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// 1) Definimos un "token" que usaremos para inyectar este objeto
export const ENV = 'ENV'; // puede ser un símbolo, un string, etc.

// 2) Definimos el provider
export const EnvProvider: Provider = {
  provide: ENV,
  useFactory: (configService: ConfigService) => {
    // Aquí sacamos los valores con configService
    const environment = configService.get<string>('environment');
    const mongodb = configService.get<string>('mongodb');
    const port = configService.get<number>('port');
    const defaultLimit = configService.get<number>('default_limit');

    return {
      CONFIG: {
        environment,
        mongodb,
        port,
        defaultLimit,
      },
      // Si quieres más secciones, las agregas aquí
      SERVICES: {
        // ...
      },
      PAGINATION: {
        DEFAULT_LIMIT: defaultLimit,
      },
    } as const; // "as const" para que infiera props de solo lectura
  },
  inject: [ConfigService],
};
