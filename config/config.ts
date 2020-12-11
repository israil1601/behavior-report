let config: {database: any} = {};


if (Deno.env.get('DATABASE_URL')) {
  config.database = Deno.env.get('DATABASE_URL');
} else {
  config.database = {
    hostname: "hattie.db.elephantsql.com",
    database: "ikanzwrs",
    user: "ikanzwrs",
    password: "SJjH7w4U23GT-zMWUV4tm2Rc64R8WIpr",
    port: 5432
  };
}

// database: Deno.env.get("PGDATABASE"),
// hostanme: Deno.env.get("PGHOST"),
// user: Deno.env.get("PGUSER"),
// password: Deno.env.get("PGPASSWORD"),
// port: Deno.env.get("PGPORT")
export { config };