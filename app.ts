import { Application, Session } from "./deps.ts";
import { router } from "./routes/routes.ts";
import * as middleware from "./middlewares/middlewares.ts";
import { viewEngine, engineFactory, adapterFactory } from "./deps.ts";


const app = new Application();
const session = new Session({ framework: "oak" });
await session.init();
app.use(session.use()(session));


const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(
  viewEngine(oakAdapter, ejsEngine)
);

app.use(middleware.errorMiddleware);
app.use(middleware.limitAccessMiddleware);
app.use(middleware.requestLoggingMiddleware);

let port = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port = Number(lastArgument);
}

app.use(router.routes());

// if page not found
app.use(middleware.pageNotFoundMiddleware);

app.listen({ port });

// export default app;
