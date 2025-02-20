const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect()
    .then(() => console.log("✅ Erfolgreich mit PostgreSQL verbunden!"))
    .catch(err => console.error("❌ Verbindung fehlgeschlagen:", err));

module.exports = client;
