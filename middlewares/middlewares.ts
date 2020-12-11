import { Middleware, RouterMiddleware } from "https://deno.land/x/oak@v6.2.0/mod.ts";

const errorMiddleware: Middleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}



export { errorMiddleware };