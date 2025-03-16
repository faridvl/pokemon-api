import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { EnvProvider } from 'src/common/config/env.provider';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService, EnvProvider],
  exports: [MongooseModule],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      },
    ]),
  ],
})
export class PokemonModule {}
