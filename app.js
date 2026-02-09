const input = document.getElementById("searchInput");
const card = document.getElementById("card");
const loader = document.getElementById("loader");

let shiny = false;

const typeColors = {
  fire: "#ff3b30",
  water: "#007aff",
  grass: "#34c759",
  electric: "#ffcc00",
  psychic: "#af52de",
  ice: "#5ac8fa",
  dragon: "#5856d6",
  dark: "#1c1c1e",
  fairy: "#ff2d55",
  normal: "#8e8e93"
};

input.addEventListener("keydown", e => {
  if (e.key === "Enter") fetchPokemon(input.value.toLowerCase());
});

async function fetchPokemon(name) {
  card.innerHTML = "";
  loader.classList.remove("hidden");

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!res.ok) throw new Error("Not Found");
    const data = await res.json();
    renderCard(data);
  } catch {
    showError();
  } finally {
    loader.classList.add("hidden");
  }
}

function renderCard(pokemon) {
  const type = pokemon.types[0].type.name;
  document.documentElement.style.setProperty(
    "--accent",
    typeColors[type] || "#007aff"
  );

  const img = shiny
    ? pokemon.sprites.other["official-artwork"].front_shiny
    : pokemon.sprites.other["official-artwork"].front_default;

  card.innerHTML = `
    <div class="card">
      <img src="${img}" />
      <h2>${pokemon.name.toUpperCase()}</h2>
      <div class="type">#${pokemon.id} • ${type}</div>

      ${pokemon.stats.map(s => `
        <div class="stat">
          <span>${s.stat.name.toUpperCase()}</span>
          <div class="bar"><div style="width:${s.base_stat / 2}%"></div></div>
        </div>
      `).join("")}

      <div class="toggle">
        <button onclick="toggleShiny()">Toggle Shiny</button>
      </div>
    </div>
  `;
}

function toggleShiny() {
  shiny = !shiny;
  fetchPokemon(input.value.toLowerCase());
}

function showError() {
  card.innerHTML = `
    <div class="error">
      <h3>Pokémon not found</h3>
      <p>Please check the spelling or try another name.</p>
    </div>
  `;
}
