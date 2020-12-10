let config: {database: any} = {};


if (Deno.env.get('DATABASE_URL')) {
  config.database = Deno.env.get('DATABASE_URL');
} else {
  config.database = {
    database: Deno.env.get("PGDATABASE"),
    hostanme: Deno.env.get("PGHOST"),
    user: Deno.env.get("PGUSER"),
    password: Deno.env.get("PGPASSWORD"),
    port: Deno.env.get("PGPORT")
  };
}


export { config };