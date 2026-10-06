import { REGIONS, POKEMON_TYPES, TYPE_COLORS } from "../config.js";
import { capitalize } from "../utils.js";

function SearchForm({
  search,
  setSearch,
  selectedRegion,
  setSelectedRegion,
  selectedType,
  setSelectedType,
}) {
  return (
    <div className="search-portal">
      <div className="search-controls">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Pokémon by name or number (#0838)..."
          className="search-input"
        />

        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(Number(e.target.value))}
          className="portal-select"
        >
          {REGIONS.map((region, index) => (
            <option key={region.name} value={index}>
              {region.name}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="portal-select"
        >
          <option value="all">All Element Types</option>
          {POKEMON_TYPES.filter((t) => t !== "all").map((type) => (
            <option key={type} value={type}>
              {capitalize(type)} Type
            </option>
          ))}
        </select>
      </div>

      {/* Quick Type Selection Pills */}
      <div className="type-pills-bar">
        {POKEMON_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`type-pill-btn ${selectedType === type ? "active" : ""}`}
            style={{
              backgroundColor:
                type === "all"
                  ? "#313131"
                  : TYPE_COLORS[type] || "#777",
            }}
          >
            {type === "all" ? "ALL TYPES" : type.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchForm;