const session = require("express-session");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(
  "task_manager.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err);
    console.log("connected to sqlite3 database");
  }
);

class dbService {
  async createAccount(data) {
    try {
      const query =
        "INSERT INTO account(username,email,password) VALUES(?,?,?)";
      const response = await new Promise((resolve, reject) => {
        db.run(query, [data.username, data.email, data.password], (err) => {
          if (err) return reject(err);
          console.log("create account query was a succes");
          return resolve(data);
        });
      });
      return response;
    } catch (err) {
      return err;
    }
  }
  async createSession(sessionID, username) {
    try {
      const query = "INSERT INTO session(session_id,username) VALUES(?,?)";
      const response = await new Promise((resolve, reject) => {
        db.run(query, [sessionID, username], (err) => {
          if (err) return reject(err);
          console.log("create session query was a succes");
          return resolve({ sessionID, username });
        });
      });
      return response;
    } catch (err) {
      console.log(err);
    }
  }
  async clearSession(sessionID) {
    try {
      const query = "DELETE FROM session WHERE session_id = ?;";
      const response = await new Promise((resolve, reject) => {
        db.run(query, [sessionID], (err) => {
          if (err) return reject(err);
          console.log("clear session query was a succes");
          return resolve({ sessionID });
        });
      });
      return response;
    } catch (err) {
      console.log(err);
    }
  }
  async login(data) {
    try {
      const query = "SELECT * FROM account WHERE username =?";
      const response = await new Promise((resolve, reject) => {
        db.all(query, [data.username], (err, rows) => {
          if (err) return reject(err);
          if (rows[0]?.password === data.password) {
            console.log("login is succesful");
            return resolve(data);
          }
          return reject({ message: "your username or password is wrong" });
        });
      });
      return response;
    } catch (err) {
      return err;
    }
  }
  async checkSession(data) {
    try {
      const query = "SELECT * FROM session WHERE username =?";
      const response = await new Promise((resolve, reject) => {
        db.all(query, [data.username], (err, rows) => {
          if (err) return reject(err);
          if (rows[0]?.session_id === data.sessionID) {
            console.log("your acces is permitted]");
            return resolve({
              username: data.username,
              sesionID: data.sessionID,
            });
          }
          return reject({ message: "Your acces is not permitted." });
        });
      });
      return response;
    } catch (err) {
      return err;
    }
  }
  async getLoggedinUser(sessionID) {
    try {
      const query = "SELECT * FROM session WHERE session_id =?";
      const response = await new Promise((resolve, reject) => {
        db.all(query, [sessionID], (err, rows) => {
          if (err) return reject(err);
          console.log(rows);
          if (rows[0]) return resolve(rows[0]);
          reject({ message: "you are not logged in" });
        });
      });
      return response;
    } catch (err) {
      return err;
    }
  }
  async createTask(data) {
    try {
      const query =
        "INSERT INTO task(title,body,deadline,username) VALUES(?,?,?,?)";
      const response = await new Promise((resolve, reject) => {
        const result = db.run(
          query,
          [data.title, data.body, data.date, data.username],
          (err, rows) => {
            if (err) return reject(err);
            console.log("adding a new task was succesfull.");

            return resolve(data);
          }
        );
      });
      return response;
    } catch (err) {
      return err;
    }
  }
  async getTask(title) {
    try {
      const query = "SELECT * FROM task WHERE title =?";
      const response = await new Promise((resolve, reject) => {
        db.all(query, [title], (err, rows) => {
          if (err) return reject(err);
          console.log(rows);
          if (rows[0]) return resolve(rows[0]);
          reject({ message: "you couldnt find the task" });
        });
      });
      return response;
    } catch (err) {
      return err;
    }
  }
  async getTasks(username) {
    try {
      const query = "SELECT * FROM task WHERE username =?";
      const response = await new Promise((resolve, reject) => {
        db.all(query, [username], (err, rows) => {
          if (err) return reject(err);
          console.log(rows);
          if (rows[0]) return resolve(rows);
          reject({ message: "you couldnt find the task" });
        });
      });
      return response;
    } catch (err) {
      return err;
    }
  }
}

module.exports = dbService;
