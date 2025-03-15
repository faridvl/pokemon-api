import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokemonResponse } from './interfaces/pokemon-response.interface';
// import { PokemonService } from 'src/pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

//TODO(!): Agraria esto en un env
const REQUEST_QUANTITY = 650;
const REQUEST_URL = `https://pokeapi.co/api/v2/pokemon?limit=${REQUEST_QUANTITY}`;

@Injectable()
export class SeedService {
  // constructor(private readonly pokemonService: PokemonService) {}

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly axiosAdapter: AxiosAdapter,
  ) {}
  // private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    //borrar todos
    await this.pokemonModel.deleteMany({});

    const pokemonsToInsert: { name: string; no: number }[] = [];
    const data = await this.axiosAdapter.get<PokemonResponse>(REQUEST_URL);

    data.results.forEach(async ({ name, url }) => {
      const splitUrl = url.split('/');
      const pokemonId: number = Number(splitUrl[splitUrl.length - 2]);
      // await this.pokemonModel.create({ no: pokemonId, name: name });
      pokemonsToInsert.push({ no: pokemonId, name: name });
    });
    await this.pokemonModel.insertMany(pokemonsToInsert);

    return 'Seed Executed';
  }
}
