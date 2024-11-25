import { Hono } from "hono";
import post from "./routers/postRouters";
import { Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

app.route("/post", post);

export default app;
