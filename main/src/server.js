import express from "express";
import pg from "pg";

const { Pool } = pg;
const app = express();
app.use(express.json());

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS commandes (
    id SERIAL PRIMARY KEY,
    item VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL
  );
`;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.DB_PORT || 5432,
});

async function initDb() {
  try {
    await pool.query(createTableQuery);
    console.log("Table 'commandes' créée avec succès.");

    const res = await pool.query("SELECT COUNT(*) FROM commandes");
    const count = parseInt(res.rows[0].count, 10);

    if (count === 0) {
      await pool.query(`
        INSERT INTO commandes (item, quantity, price) VALUES
        ('Veste en jean', 2, 89.99),
        ('T-shirt basique blanc', 5, 19.99),
        ('Pantalon cargo noir', 1, 59.99);
      `);
      console.log("Commandes de vêtements par défaut insérées !");
    }
  } catch (err) {
    console.error(
      "Erreur lors de l'initialisation de la base de données :",
      err,
    );
  }
}

app.get("/commandes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM commandes ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/commandes", async (req, res) => {
  const { item, quantity, price } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO commandes (item, quantity, price) VALUES ($1, $2, $3) RETURNING *",
      [item, quantity, price],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

initDb().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
});

app.get("/commandes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM commandes ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/commandes", async (req, res) => {
  const { item, quantity, price } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO commandes (item, quantity, price) VALUES ($1, $2, $3) RETURNING *",
      [item, quantity, price],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
