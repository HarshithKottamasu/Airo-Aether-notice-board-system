CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20)
);

CREATE TABLE notices (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event_type VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    sport VARCHAR(50),
    team1 VARCHAR(50),
    team2 VARCHAR(50),
    score VARCHAR(20),
    status VARCHAR(20)
);

CREATE TABLE themes (
    id SERIAL PRIMARY KEY,
    day VARCHAR(20),
    theme VARCHAR(50)
);