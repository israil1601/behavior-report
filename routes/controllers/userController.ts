import { Context } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { headerState } from "../../services/helpers.ts";
import {
  isExistingUser,
  registerUser,
  authenticateUser,
} from "../../services/userService.ts";

const register = async ({ request, response, session, render }: Context) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get("email");
  const password = params.get("password");
  const verification = params.get("verification");

  if (password !== verification) {
    render("views/register.ejs", {
      error: "Passwords do not match.",
      ...(await headerState(session)),
      emailInput: email
    });
    return;
  }

  if (await isExistingUser(email)) {
    render("views/register.ejs", {
      error: "User with this email already exists.",
      ...(await headerState(session)),
      emailInput: email
    });
    return;
  }
  const { id } = (await registerUser(email, password))[0];

  await session.set("authenticated", true);
  await session.set("user", {
    id,
    email,
  });

  response.redirect("/behavior/summary/weekly");
};

const showLoginForm = async ({ render, session }: Context) => {
  render("views/login.ejs", { ...(await headerState(session)), error: "", emailInput: '' });
};

const showRegistrationForm = async ({ render, session }: Context) => {
  render("views/register.ejs", { ...(await headerState(session)), error: "", emailInput: '' });
};

const authenticate = async ({ request, response, render, session }: Context) => {
  const body = request.body();
  const params = await body.value;
  const email = params.get("email");
  const password = params.get("password");

  const id = await authenticateUser(email, password);

  if (!id) {
    render("views/login.ejs", {
      error: "Email and/or password are incorrect.",
      ...(await headerState(session)),
      emailInput: email
    });
    return;
  }

  await session.set("authenticated", true);
  await session.set("user", {
    id,
    email,
  });
  
  response.redirect("/");
};

const logout = async ({ response, session }) => {
  await session.set("authenticated", false);
  await session.set("user", null);

  response.redirect("/");
};

export { register, authenticate, showLoginForm, showRegistrationForm, logout };
