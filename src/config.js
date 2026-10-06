export const API_BASE_URL = "https://pokeapi.co/api/v2";
export const SPRITE_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
export const CRY_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest";

export const TYPE_COLORS = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705848",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export const POKEMON_TYPES = [
  "all",
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export const REGIONS = [
  { name: "All Generations (1 - 1025)", limit: 1025, offset: 0 },
  { name: "Kanto (Gen 1: #001 - #151)", limit: 151, offset: 0 },
  { name: "Johto (Gen 2: #152 - #251)", limit: 100, offset: 151 },
  { name: "Hoenn (Gen 3: #252 - #386)", limit: 135, offset: 251 },
  { name: "Sinnoh (Gen 4: #387 - #493)", limit: 107, offset: 386 },
  { name: "Unova (Gen 5: #494 - #649)", limit: 156, offset: 493 },
  { name: "Kalos (Gen 6: #650 - #721)", limit: 72, offset: 649 },
  { name: "Alola (Gen 7: #722 - #809)", limit: 88, offset: 721 },
  { name: "Galar (Gen 8: #810 - #905)", limit: 96, offset: 809 },
  { name: "Paldea (Gen 9: #906 - #1025)", limit: 120, offset: 905 },
];