import { Hono } from "hono";
import { cors } from "hono/cors";
import {
    getPostView,
    updatePostView,
} from "../controllers/postControllers";
import { Bindings } from "../types";

const post = new Hono<{ Bindings: Bindings }>();

post.use(
    cors({
        origin: (origin, c) => {
            return "*";
        },
    })
);

post.post("/:key/view", (c) => updatePostView(c));

post.get("/:key/view", (c) => getPostView(c));

export default post;
