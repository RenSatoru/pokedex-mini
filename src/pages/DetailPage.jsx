import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL, TYPE_COLORS } from "../config.js";
import {
  capitalize,
  getOfficialArtworkUrl,
  getCryUrl,
  parseEvolutionChain,
  getTypeGradient,
} from "../utils.js";

function DetailPage() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [isShiny, setIsShiny] = useState(false);
  const [selectedFormUrl, setSelectedFormUrl] = useState(null);
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function fetchDetails() {
      setIsLoading(true);
      setError(null);
      setSelectedAbility(null);

      try {
        const targetUrl = selectedFormUrl || `${API_BASE_URL}/pokemon/${name}`;
        const pokeRes = await fetch(targetUrl);
        if (!pokeRes.ok) throw new Error(`Pokémon "${name}" not found.`);
        const pokeData = await pokeRes.json();

        const speciesRes = await fetch(pokeData.species.url);
        const speciesData = speciesRes.ok ? await speciesRes.json() : null;

        let parsedEvoChain = [];
        if (speciesData?.evolution_chain?.url) {
          const evoRes = await fetch(speciesData.evolution_chain.url);
          if (evoRes.ok) {
            const evoData = await evoRes.json();
            parsedEvoChain = parseEvolutionChain(evoData.chain);
          }
        }

        if (isCurrent) {
          setPokemon(pokeData);
          setSpecies(speciesData);
          setEvolutionChain(parsedEvoChain);
        }
      } catch (err) {
        if (isCurrent) setError(err.message);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    fetchDetails();
    return () => {
      isCurrent = false;
    };
  }, [name, selectedFormUrl]);

  const playCry = () => {
    if (!pokemon) return;
    const audio = new Audio(getCryUrl(pokemon.id));
    audio.play().catch(() => {});
  };

  const handleAbilityClick = async (abilityObj) => {
    try {
      const res = await fetch(abilityObj.ability.url);
      if (!res.ok) return;
      const data = await res.json();
      const englishEffect =
        data.effect_entries?.find((e) => e.language.name === "en")?.effect ||
        data.flavor_text_entries?.find((f) => f.language.name === "en")?.flavor_text ||
        "No description available for this ability.";

      setSelectedAbility({
        name: abilityObj.ability.name,
        effect: englishEffect.replace(/[\n\f]/g, " "),
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) return <p className="status">Loading data for {name}…</p>;
  if (error) return <p className="status status-error">{error}</p>;

  const flavorText = species?.flavor_text_entries?.find(
    (entry) => entry.language.name === "en"
  )?.flavor_text.replace(/[\n\f]/g, " ");

  const category = species?.genera?.find((g) => g.language.name === "en")?.genus;

  const currentId = species?.id || pokemon.id;
  const prevId = currentId > 1 ? currentId - 1 : 1025;
  const nextId = currentId < 1025 ? currentId + 1 : 1;

  const hasShinyArtwork = Boolean(
    pokemon.sprites?.other?.["official-artwork"]?.front_shiny
  );

  const pageGradient = getTypeGradient(pokemon.types);

  return (
    <div className="page-type-wrapper" style={{ background: pageGradient }}>
      <div className="detail-portal">
        {/* 1. Official-Style Top Navigation Header */}
        <div className="portal-top-nav">
          <Link to={`/pokemon/${prevId}`} className="top-nav-half left">
            <span className="nav-arrow-icon">‹</span>
            <span className="nav-text">#{prevId.toString().padStart(4, "0")}</span>
          </Link>
          <Link to={`/pokemon/${nextId}`} className="top-nav-half right">
            <span className="nav-text">#{nextId.toString().padStart(4, "0")}</span>
            <span className="nav-arrow-icon">›</span>
          </Link>
        </div>

        <div className="detail-header-title">
          <h1>
            {capitalize(pokemon.name)}{" "}
            <span className="id-sub">#{pokemon.id.toString().padStart(4, "0")}</span>
          </h1>
        </div>

        <div className="detail-main-grid">
          {/* 2. 70:30 Showcase Split Stage */}
          <div className="showcase-card">
            {/* Top Right Floating Shiny Toggle */}
            <button
              onClick={() => setIsShiny(!isShiny)}
              disabled={!hasShinyArtwork}
              className={`shiny-top-badge ${isShiny ? "active" : ""} ${
                !hasShinyArtwork ? "disabled" : ""
              }`}
              title={hasShinyArtwork ? "Toggle Shiny Artwork" : "No Shiny Artwork Available"}
            >
              ✨ {isShiny ? "Shiny" : "Standard"}
            </button>

            <div className="showcase-split">
              {/* 70% Image Area */}
              <div className="showcase-image-area">
                <img
                  src={getOfficialArtworkUrl(pokemon.id, isShiny)}
                  alt={pokemon.name}
                  className="main-artwork"
                />
              </div>

              {/* 30% Controls Area */}
              <div className="showcase-controls-area">
                {/* Icon-Only Speaker Button */}
                <button
                  onClick={playCry}
                  className="icon-cry-btn"
                  title="Play Pokémon Cry"
                >
                  🔊
                </button>

                {/* Alternate Forms Dropdown */}
                {species?.varieties?.length > 1 && (
                  <div className="forms-selector">
                    <label className="forms-label">Form Variants:</label>
                    <select
                      className="forms-dropdown"
                      value={
                        species.varieties.find((v) => v.pokemon.name === pokemon.name)
                          ?.pokemon.url || ""
                      }
                      onChange={(e) => setSelectedFormUrl(e.target.value)}
                    >
                      {species.varieties.map((v) => (
                        <option key={v.pokemon.name} value={v.pokemon.url}>
                          {capitalize(v.pokemon.name)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column Specifications */}
          <div className="info-column">
            {flavorText && <p className="flavor-quote">"{flavorText}"</p>}

            {/* 3. Specs Info Box with Bound Ability Overlay */}
            <div className="official-blue-box">
              <div className="box-row">
                <div>
                  <span className="box-label">Height</span>
                  <span className="box-val">{(pokemon.height / 10).toFixed(1)} m</span>
                </div>
                <div>
                  <span className="box-label">Category</span>
                  <span className="box-val">{category || "Unknown"}</span>
                </div>
              </div>

              <div className="box-row">
                <div>
                  <span className="box-label">Weight</span>
                  <span className="box-val">{(pokemon.weight / 10).toFixed(1)} kg</span>
                </div>
                <div>
                  <span className="box-label">Abilities</span>
                  <div className="abilities-list">
                    {pokemon.abilities.map((a) => (
                      <span key={a.ability.name} className="ability-item">
                        {capitalize(a.ability.name)}
                        <button
                          onClick={() => handleAbilityClick(a)}
                          className="ability-info-btn"
                          title="View ability details"
                        >
                          ?
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card-Bound Ability Description Overlay */}
              {selectedAbility && (
                <div className="bound-ability-overlay">
                  <div className="bound-overlay-header">
                    <span className="overlay-title">Ability Info</span>
                    <button
                      className="overlay-close-btn"
                      onClick={() => setSelectedAbility(null)}
                    >
                      ✕ Close
                    </button>
                  </div>
                  <h4 className="overlay-ability-name">
                    {capitalize(selectedAbility.name)}
                  </h4>
                  <p className="overlay-ability-text">{selectedAbility.effect}</p>
                </div>
              )}
            </div>

            <div className="type-section">
              <h3>Type</h3>
              <div className="badge-row">
                {pokemon.types.map((t) => (
                  <span
                    key={t.type.name}
                    className="type-badge-pill"
                    style={{ backgroundColor: TYPE_COLORS[t.type.name] }}
                  >
                    {t.type.name.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats Bars */}
            <div className="stats-box">
              <h3>Base Stats</h3>
              <div className="stat-bars-container">
                {pokemon.stats.map((s) => {
                  const percent = Math.min(100, (s.base_stat / 180) * 100);
                  return (
                    <div key={s.stat.name} className="stat-item">
                      <span className="stat-name">{s.stat.name.replace("-", " ")}</span>
                      <div className="stat-bar-track">
                        <div
                          className="stat-bar-fill-blue"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="stat-value">{s.base_stat}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Evolution Line */}
        {evolutionChain.length > 1 && (
          <div className="evolution-portal-card">
            <h2>Evolutions</h2>
            <div className="evo-flex">
              {evolutionChain.map((stage, i) => (
                <div key={stage.name} className="evo-node">
                  <Link
                    to={`/pokemon/${stage.name}`}
                    className={`evo-card ${
                      stage.name === pokemon.name ? "current" : ""
                    }`}
                  >
                    <img
                      src={getOfficialArtworkUrl(stage.id, isShiny)}
                      alt={stage.name}
                      width={90}
                      height={90}
                    />
                    <span className="evo-name">{capitalize(stage.name)}</span>
                    <span className="evo-id">#{stage.id.padStart(4, "0")}</span>
                  </Link>
                  {i < evolutionChain.length - 1 && <div className="evo-arrow">❯</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailPage;