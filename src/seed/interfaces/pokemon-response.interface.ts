export interface PokemonResponse {
  count: number;
  next: string;
  previous: null;
  results: PokemonData[];
}

export interface PokemonData {
  name: string;
  url: string;
}
