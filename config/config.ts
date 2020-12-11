import { config } from "../deps.ts";

let databaseConifig: any;

if (Deno.env.get("DATABASE_URL")) {
  databaseConifig = Deno.env.get("DATABASE_URL");
} else {
  let env = config();
  databaseConifig = {
    hostname: env.PGHOST,
    database: env.PGDATABASE,
    user: env.PGUSER,
    password: env.PGPASSWORD,
    port: +env.PGPORT,
  };
}

export { databaseConifig };
