import { SPRITE_BASE_URL, CRY_BASE_URL } from "./config.js";
import { TYPE_COLORS } from "./config.js";

export function getTypeGradient(types) {
  if (!types || types.length === 0) return "linear-gradient(135deg, #1a1a24 0%, #272738 100%)";

  const color1 = TYPE_COLORS[types[0].type.name] || "#272738";
  const color2 = types[1]
    ? TYPE_COLORS[types[1].type.name] || color1
    : color1;

  // Blends typing colors smoothly at low opacities over dark backgrounds
  return `linear-gradient(135deg, ${color1}44 0%, ${color2}22 50%, #1a1a24 100%)`;
}

export function getIdFromUrl(url) {
  if (!url) return "";
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

export function capitalize(name) {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).replace("-", " ");
}

export function getOfficialArtworkUrl(id, isShiny = false) {
  if (!id) return "";
  const variant = isShiny ? "shiny" : "front_default";
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${variant === "shiny" ? "shiny/" : ""}${id}.png`;
}

export function getCryUrl(id) {
  return `${CRY_BASE_URL}/${id}.ogg`;
}

// Helper to recursively parse evolutionary chains from PokeAPI
export function parseEvolutionChain(chainNode) {
  const chain = [];
  let current = chainNode;

  while (current) {
    const id = getIdFromUrl(current.species.url);
    const details = current.evolution_details[0];
    
    chain.push({
      name: current.species.name,
      id: id,
      minLevel: details?.min_level || null,
      item: details?.item?.name || null,
      trigger: details?.trigger?.name || null,
    });

    // Takes primary evolution branch for linear flow
    current = current.evolves_to[0];
  }

  return chain;
}