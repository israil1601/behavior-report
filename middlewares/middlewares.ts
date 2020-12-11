import {
  Middleware,
  RouterContext,
  RouterMiddleware,
} from "https://deno.land/x/oak@v6.2.0/mod.ts";

const errorMiddleware: Middleware = async (context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
};

const limitAccessMiddleware = async (
  { response, session, request }: RouterContext,
  next
) => {
  const path = request.url.pathname;
  const isAccessible =
    path === "/" ||
    path.startsWith("/api") ||
    path.startsWith("/auth") ||
    (await session.get("authenticated"));

  if (isAccessible) await next();

  else response.redirect('/auth/login');
};

export { errorMiddleware, limitAccessMiddleware };
