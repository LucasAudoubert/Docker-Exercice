import { Client } from "pg";

const client = new Client({
  user: "database-user",
  password: "secretpassword!!",
  host: "my.database-server.com",
  port: 4444,
  database: "super-cool-database",
});

export default client;
await client.connect();