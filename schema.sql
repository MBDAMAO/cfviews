CREATE TABLE IF NOT EXISTS articles (
    post_id TEXT PRIMARY KEY,
    views INTEGER,
    view_time TEXT -- 这里将TIMESTAMP改为TEXT，因为TIMESTAMP是SQLite的保留字
);