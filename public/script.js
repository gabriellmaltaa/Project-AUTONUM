const form = document.getElementById("search-form");
const input = document.getElementById("q");
const grid = document.getElementById("grid");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  grid.innerHTML = "";

  // Skeletons enquanto carrega
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
    const resp = await fetch(`/api?q=${encodeURIComponent(query)}`);
    const data = await resp.json();

    grid.innerHTML = ""; // limpa skeletons

    if (!data.resultados || data.resultados.length === 0) {
      grid.innerHTML = "<p>Nenhum produto encontrado 😢</p>";
      return;
    }

    data.resultados.forEach(item => grid.appendChild(renderCard(item)));
  } catch (err) {
    console.error(err);
    grid.innerHTML = "<p>⚠️ Erro ao buscar produtos</p>";
  }
});

function renderCard(item) {
  const preco = item.preco !== undefined && item.preco !== null
    ? `R$ ${Number(item.preco).toFixed(2)}`
    : "Preço não informado";

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <span class="badge ${item.source === 'Mercado Livre' ? 'ml' : 'olx'}">${item.source}</span>
    <img src="${item.thumbnail}" alt="${item.titulo}">
    <h3>${item.titulo}</h3>
    <div class="price">${preco}</div>
    <a href="${item.link}" target="_blank" class="btn">
      Comprar
    </a>
  `;
  return card;
}
