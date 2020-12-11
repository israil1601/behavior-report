import { Middleware, Context, send } from "../deps.ts";

const errorMiddleware: Middleware = async (context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
};

const limitAccessMiddleware: Middleware = async (
  { response, session, request }: Context,
  next: Function
) => {
  const path = request.url.pathname;
  const isAccessible =
    path === "/" ||
    path.startsWith("/api") ||
    path.startsWith("/auth") ||
    (await session.get("authenticated"));

  if (isAccessible) await next();
  else response.redirect("/auth/login");
};

const requestLoggingMiddleware: Middleware = async ({request, session}: Context, next: Function) => {
  const time = new Date().toJSON();
  const user = await session.get('user');
  const id = user ? user.id : 'anonymous';

  console.log(`
  Current time: ${time}
  Request method: ${request.method}
  Requested path: ${request.url.pathname}
  User id: ${id}
  `)

  await next();
}

const serveStaticFilesMiddleware: Middleware = async (context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);

    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });

  } else {
    await next();
  }
}

const pageNotFoundMiddleware: Middleware = async ({response}, next) => {
  response.redirect('/');
}



export { errorMiddleware, limitAccessMiddleware, requestLoggingMiddleware, serveStaticFilesMiddleware, pageNotFoundMiddleware };
