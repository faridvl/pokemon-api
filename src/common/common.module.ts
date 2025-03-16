import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';
import { EnvProvider } from './config/env.provider';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joiSchema.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
      isGlobal: true,
      // isGlobal:true evita tener que importar el ConfigModule en cada módulo
    }),
  ],
  providers: [AxiosAdapter, EnvProvider],
  exports: [AxiosAdapter, EnvProvider],
})
export class CommonModule {}
