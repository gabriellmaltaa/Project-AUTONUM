// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// Rota para buscar no Mercado Livre
app.get("/api/search", async (req, res) => {
  try {
    const q = req.query.q;
    const resp = await fetch(
      `https://api.mercadolivre.com/sites/MLB/search?q=${encodeURIComponent(q)}&limit=8`
    );
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar no Mercado Livre" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));
