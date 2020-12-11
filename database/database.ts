import { Pool } from "../deps.ts";
import { databaseConifig } from "../config/config.ts";

const CONCURRENT_CONNECTIONS = 3;
const connectionPool = new Pool(databaseConifig, CONCURRENT_CONNECTIONS);

const executeQuery = async (query, ...params) => {
  const client = await connectionPool.connect();
  try {
    return await client.query(query, ...params);
  } catch (e) {
    console.log(e);
  } finally {
    client.release();
  }

  return null;
};
export { executeQuery };
