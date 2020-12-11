# Behavior reporting application
Keep track of your behavior throught the day to get a better glimpse of your lifestyle!
Deployed version is available [here](https://behavior-report.herokuapp.com).
## Prerequisites
* Deno installed
* Set up a database
## Running the application
* First, create .env file at the root directry with following content (paste your database credentials):
```
PGHOST=${db_hostname} 
PGDATABASE=${db_name}
PGUSER=${db_user}
PGPASSWORD=${db_password}
PGPORT=${db_port}
```
* Create tables created with following commands:
```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(320) NOT NULL,
    password CHAR(60) NOT NULL
);

CREATE UNIQUE INDEX ON users((lower(email)));

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    sleep_duration NUMERIC(100, 2),
    sleep_quality INTEGER,
    eating_quality INTEGER,
    generic_mood_morning INTEGER,
    generic_mood_evening INTEGER,
    study_duration NUMERIC(100, 2),
    sports_duration NUMERIC(100, 2),
    reported_date date,
    user_id INTEGER REFERENCES users(id)
);
```

* Run the application:
```
deno run --allow-net --allow-read --allow-env --no-check app.ts
```
## Testing the application
```
deno test --coverage --unstable tests/tests.ts
```