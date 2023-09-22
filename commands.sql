CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('Dan Abramov', 'example.com', 'On let vs const');

INSERT INTO blogs (author, url, title) VALUES ('Laurenz Albe', 'example.com', 'Gaps in sequences in PostgreSQL');