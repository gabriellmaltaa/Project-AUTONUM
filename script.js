const form = document.getElementById("search-form");
const input = document.getElementById("q");
const grid = document.getElementById("grid");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  grid.innerHTML = "";

  // Mostra skeletons enquanto carrega
  for (let i = 0; i < 8; i++) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton skeleton-text" style="width: 80%"></div>
      <div class="skeleton skeleton-text" style="width: 50%"></div>
      <div class="skeleton skeleton-text" style="width: 40%"></div>
    `;
    grid.appendChild(card);
  }

  try {
    const [mlResults /* futuras integrações: Shopee, OLX etc */] = await Promise.all([
      fetchML(query),
    ]);

    grid.innerHTML = ""; // limpa skeletons

    const allResults = [...mlResults]; // agrupa marketplaces

    if (!allResults.length) {
      grid.innerHTML = "<p>Nenhum produto encontrado 😢</p>";
      return;
    }

    allResults.forEach(item => grid.appendChild(renderCard(item)));
  } catch (err) {
    console.error(err);
    grid.innerHTML = "<p>⚠️ Erro ao buscar produtos</p>";
  }
});

async function fetchML(query) {
  const resp = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&limit=8`);
  const data = await resp.json();
  return data.results.map(item => ({
    title: item.title,
    price: item.price,
    thumbnail: item.thumbnail,
    link: item.permalink,
    source: "Mercado Livre"
  }));
}

function renderCard(item) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${item.thumbnail}" alt="${item.title}">
    <h3>${item.title}</h3>
    <div class="price">R$ ${item.price.toFixed(2)}</div>
    <a href="${item.link}" target="_blank" class="btn">Comprar no ${item.source}</a>
  `;
  return card;
}
