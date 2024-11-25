import { Context } from "hono";
import { ArticleRow } from "../models";

export const getPostView = async (c: Context) => {
    const post_id = c.req.param("key");
    try {
        // @ts-ignore
        let article = await c.env.DB.prepare(
            "SELECT * FROM articles WHERE post_id = ?"
        )
            .bind(post_id)
            .first<ArticleRow>();
        if (!article) {
            return c.json({ views: 0 });
        } else {
            return c.json({ views: article.views });
        }
    } catch (e) {
        console.log(e);
        return c.json({ err: e }, 500);
    }
};

function get_ip(c: Context) {
    // 检查 X-Forwarded-For
    let ip = c.req.header("x-forwarded-for");
    if (ip) {
        // X-Forwarded-For 可以包含多个 IP，取第一个
        ip = ip.split(",")[0].trim();
    } else {
        // 检查 X-Real-IP
        ip = c.req.header("x-real-ip");
    }

    // 如果没有代理头，使用连接信息中的 IP
    if (!ip) {
        ip = c.req.header("host"); // 或其他方式获取连接 IP
    }
    return ip;
}

async function view_post_handler(c: Context) {
    const post_id = c.req.param("key");
    const ip = get_ip(c);

    try {
        let key = "[" + post_id + "][" + ip + "]";
        let check = await c.env.KV.get(key);
        if (check == "true") {
            // 如果存在，说明已经浏览过，不用管

        }
        else {
            // 添加一个30分钟的浏览KV
            await c.env.KV.put(key, true, { expirationTtl: 60 * 30 });
            // 浏览数+1
            // @ts-ignore
            let article = await c.env.DB.prepare(
                "SELECT * FROM articles WHERE post_id = ?"
            )
                .bind(post_id)
                .first<ArticleRow>();
            if (!article) {
                await c.env.DB.prepare(
                    "INSERT INTO articles (post_id, views) VALUES (?, ?)"
                )
                    .bind(post_id, 1)
                    .run();
            } else {
                await c.env.DB.prepare(
                    "UPDATE articles SET views = ? WHERE post_id = ?"
                )
                    .bind(article.views + 1, post_id)
                    .run();
            }
        }
    } catch (e) {
        console.log(e);
    }
}

export const updatePostView = async (c: Context) => {
    // 直接返回阅读数，然后异步判断更新
    let views = await getPostView(c);
    await view_post_handler(c);
    return views;
};