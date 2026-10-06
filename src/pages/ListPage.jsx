import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchForm from "../components/SearchForm.jsx";
import { API_BASE_URL, REGIONS } from "../config.js";
import { getIdFromUrl, capitalize, getOfficialArtworkUrl } from "../utils.js";

function ListPage() {
  const [pokemons, setPokemons] = useState([]);
  const [typeMap, setTypeMap] = useState({});
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch full list of 1025 pokemons for chosen region
  useEffect(() => {
    async function loadPokemons() {
      setIsLoading(true);
      setError(null);
      const region = REGIONS[selectedRegion];

      try {
        const response = await fetch(
          `${API_BASE_URL}/pokemon?limit=${region.limit}&offset=${region.offset}`
        );
        if (!response.ok) throw new Error("Failed to load Pokémon list.");
        const data = await response.json();
        setPokemons(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadPokemons();
  }, [selectedRegion]);

  // Fetch type metadata when filtering by specific type
  useEffect(() => {
    if (selectedType === "all") return;

    async function fetchTypePokemons() {
      try {
        const res = await fetch(`${API_BASE_URL}/type/${selectedType}`);
        if (res.ok) {
          const data = await res.json();
          const namesSet = new Set(data.pokemon.map((p) => p.pokemon.name));
          setTypeMap((prev) => ({ ...prev, [selectedType]: namesSet }));
        }
      } catch (e) {}
    }

    if (!typeMap[selectedType]) {
      fetchTypePokemons();
    }
  }, [selectedType, typeMap]);

  const filteredPokemons = pokemons.filter((p) => {
    const id = getIdFromUrl(p.url);
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      id.toString() === search.replace("#", "").trim();

    const matchesType =
      selectedType === "all" ||
      (typeMap[selectedType] && typeMap[selectedType].has(p.name));

    return matchesSearch && matchesType;
  });

  return (
    <div>
      <SearchForm
        search={search}
        setSearch={setSearch}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      {isLoading && <p className="status">Loading Pokédex database…</p>}
      {error && <p className="status status-error">{error}</p>}

      {!isLoading && !error && (
        <div className="pokemon-grid">
          {filteredPokemons.map((pokemon) => {
            const id = getIdFromUrl(pokemon.url);
            return (
              <Link
                key={pokemon.name}
                to={`/pokemon/${pokemon.name}`}
                className="portal-card"
              >
                <div className="card-stage">
                  <img
                    className="card-artwork"
                    src={getOfficialArtworkUrl(id)}
                    alt={pokemon.name}
                    width={140}
                    height={140}
                    loading="lazy"
                  />
                </div>
                <div className="card-details">
                  <span className="card-id">#{id.padStart(4, "0")}</span>
                  <h3 className="card-name">{capitalize(pokemon.name)}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ListPage;