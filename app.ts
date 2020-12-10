import { Application } from "./deps.ts";
import { router } from "./routes/routes.ts";
import * as middleware from "./middlewares/middlewares.ts";
import { viewEngine, engineFactory, adapterFactory } from "./deps.ts";

const app = new Application();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(
  viewEngine(oakAdapter, ejsEngine)
);


app.use(middleware.errorMiddleware);
// app.use(middleware.requestTimingMiddleware);
// app.use(middleware.serveStaticFilesMiddleware);

let port = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port = Number(lastArgument);
}

console.log("runs")
app.use(router.routes());

app.listen({ port });

// export default app;
