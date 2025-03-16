import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfiguration } from './common/config/env.config';
import { JoiValidationSchema } from './common/config/joiSchema.validation';
import { ENV, EnvProvider } from './common/config/env.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath  => en caso de querer leer el env de otra ruta fuera del root
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (env: IEnvObject) => ({
    //     uri: env.CONFIG.mongodb,
    //   }),
    //   inject: [ENV],
    // }),
    MongooseModule.forRoot(process.env.MONGODB ?? ''),
    PokemonModule,
    SeedModule,
    CommonModule,
  ],
  providers: [EnvProvider],
  exports: [
    EnvProvider, // Para inyectarlo en otros módulos
  ],
})
export class AppModule {}
