-- drop table session;
-- CREATE TABLE session(
-- session_id TEXT NOT NULL PRIMARY KEY,
-- username TEXT NOT NULL,
-- FOREIGN KEY(username) REFERENCES account(username) 

-- );
--  INSERT INTO session(session_id,username)
--  VALUES (1212121,"eda");
-- CREATE TABLE account(
-- username TEXT NOT NULL PRIMARY KEY, 
-- password TEXT NOT NULL,
-- email TEXT NOT NULL UNIQUE
-- );
DROP TABLE task;
CREATE TABLE task(
task_id INTEGER PRIMARY KEY AUTOINCREMENT,
body TEXT,
title TEXT NOT NULL UNIQUE,
deadline TEXT NOT NULL,
username TEXT,
FOREIGN KEY(username) REFERENCES account(username)
);
-- DELETE FROM session;