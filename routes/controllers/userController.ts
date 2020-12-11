import { Context } from "../../deps.ts";
import {
  getHeaderState,
  isEmpty
} from "../../helpers/helpers.ts";
import { validateRegistrationForm } from "../../helpers/validation.ts";
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

  const errors = await validateRegistrationForm({ email, password });

  if (password !== verification)
    errors.verification = { passwordMatch: "passwords do not match." };

  if (!errors.email && (await isExistingUser(email)))
    errors.email = { isUnique: "user with this email already exists." };

  if (!isEmpty(errors)) {
    render("views/register.ejs", {
      ...(await getHeaderState(session)),
      errors,
      emailInput: email,
    });
    return;
  }

  const { id } = (await registerUser(email, password))[0];

  await session.set("authenticated", true);
  await session.set("user", {
    id,
    email,
  });

  response.redirect("/");
};

const showLoginForm = async ({ render, session }: Context) => {
  render("views/login.ejs", {
    ...(await getHeaderState(session)),
    errors: '',
    emailInput: "",
  });
};


const showRegistrationForm = async ({ render, session }: Context) => {
  render("views/register.ejs", {
    ...(await getHeaderState(session)),
    errors: {},
    emailInput: "",
  });
};


const authenticate = async ({
  request,
  response,
  render,
  session,
}: Context) => {
  const body = request.body();
  const params = await body.value;
  const email = params.get("email");
  const password = params.get("password");

  const id = await authenticateUser(email, password);

  if (!id) {
    render("views/login.ejs", {
      errors: "Email and/or password are incorrect.",
      ...(await getHeaderState(session)),
      emailInput: email,
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

const logOut = async ({ response, session }) => {
  await session.set("authenticated", false);
  await session.set("user", null);

  response.redirect("/");
};

export { register, authenticate, showLoginForm, showRegistrationForm, logOut };
