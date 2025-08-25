export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Faltou o parâmetro q" });
  }

  try {
    // ----- Mercado Livre -----
    const mlResp = await fetch(
      `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(q)}&limit=8`
    );
    const mlData = await mlResp.json();

    const mlResults = mlData.results.map(item => ({
      title: item.title,
      price: item.price,
      thumbnail: item.thumbnail,
      link: item.permalink,
      source: "Mercado Livre"
    }));

    // ----- OLX (simples) -----
    let olxResults = [];
    try {
      const olxResp = await fetch(`https://www.olx.com.br/api/v1/items?searchTerm=${encodeURIComponent(q)}&size=8`);
      if (olxResp.ok) {
        const olxData = await olxResp.json();
        if (olxData && olxData.data) {
          olxResults = olxData.data.map(item => ({
            title: item.title,
            price: item.price?.value || null,
            thumbnail: item.images?.[0]?.url || "",
            link: `https://www.olx.com.br/item/${item.id}`,
            source: "OLX"
          }));
        }
      }
    } catch (err) {
      console.warn("Erro ao buscar OLX:", err.message);
    }

    // juntar todos os marketplaces
    const allResults = [...mlResults, ...olxResults];

    res.status(200).json(allResults);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
}
