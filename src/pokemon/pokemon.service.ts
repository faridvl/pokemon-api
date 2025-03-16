import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { isValidObjectId, Model } from 'mongoose';

import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ENV } from 'src/common/config/env.provider';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor(
    private readonly configService: ConfigService,
    @Inject(ENV)
    private readonly env: IEnvObject,
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {
    this.defaultLimit = this.env.PAGINATION.DEFAULT_LIMIT;
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = pagination;
    const result = await this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1,
      })
      .select('-__v');
    return result;
  }

  async findOne(term: string) {
    //TODO(!): Disclaimer => Esto estas validaciones deberian de hacerse desde el validator/dto
    // no es responsabilidad del service validar esto
    // 1. Si el "term" es un número, buscar por "no"
    if (!isNaN(+term)) {
      const pokemonByNo = await this.pokemonModel.findOne({ no: term });
      if (pokemonByNo) return pokemonByNo;
    }

    // 2. Si el "term" es un ObjectId válido, buscar por _id
    if (isValidObjectId(term)) {
      const pokemonById = await this.pokemonModel.findById(term);
      if (pokemonById) return pokemonById;
    }

    // 3. Si llegamos aquí, intentamos buscar por "name"
    const pokemonByName = await this.pokemonModel.findOne({ name: term });
    if (pokemonByName) return pokemonByName;

    // 4. Si no encontramos nada en las tres búsquedas, lanzamos error
    throw new NotFoundException(
      `pokemon with id, name or no "${term}" not found.`,
    );
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    try {
      const updatedPokemon = await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toJSON(), ...updatedPokemon };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // const pokemon = await this.pokemonModel.findByIdAndDelete(id);
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (!deletedCount) {
      throw new BadRequestException(`pokemon with id ${id} not found.`);
    }
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon already exist in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Cant update pokemon - check the logs`,
    );
  }
}
