import { executeQuery } from "../database/database.ts";
import { hash, compare, Session } from "../deps.ts";

const isExistingUser = async (email: string) => {
  const existingUsers = await executeQuery(
    "SELECT * FROM users WHERE email = $1",
    email
  );

  return existingUsers?.rowCount > 0;
};

const registerUser = async (email: string, password: string) => {
  const passwordHash = await hash(password);
  await executeQuery(
    "INSERT INTO users (email, password) VALUES ($1, $2);",
    email,
    passwordHash
  );

  const res = await executeQuery(
    "SELECT id FROM users WHERE email = $1 AND password = $2",
    email,
    passwordHash
  );

  return res?.rowsOfObjects();
};

const authenticateUser = async (email: string, password: string) => {
  const res = await executeQuery(
    "SELECT * FROM users WHERE email = $1;",
    email
  );
  if (!res?.rowCount) return;

  const userObj = res.rowsOfObjects()[0];

  const hash = userObj.password;
  const isCorrectPassword = await compare(password, hash);
  if (!isCorrectPassword) return;

  return userObj.id;
};



export { isExistingUser, registerUser, authenticateUser };
