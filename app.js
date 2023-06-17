const express = require("express");
const app = express();
const dotenv = require("dotenv");
const dbService = require("./dbService");
const session = require("express-session");
const DB = new dbService();
const cookieParser = require("cookie-parser");
dotenv.config();
console.log(process.env.PORT);
const port = process.env.PORT || 3000;
const path = require("path");
//MIDDLEWARES***************************************************************************
app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(express.static("client"));
app.use(express.json());
app.use(cookieParser());

app.use("/tasks", async (request, response, next) => {
  console.log(request.path);
  const username = request.path.split("/")[1];
  console.log("userame:", username);
  const sessionID = request.cookies.session;
  const dbResponse = await DB.checkSession({ sessionID, username });
  console.log("db response:", dbResponse);
  console.log(dbResponse.message);
  if (!dbResponse.username) {
    return response.sendFile(path.resolve("./client/routes/permision.html"));
  }
  next();
});
//GET REQUESTS*****************************************************************************
app.get("/", async (request, response) => {
  const sessionID = request.cookies.session;
  if (sessionID) {
    const dbResponse = await DB.getLoggedinUser(sessionID);
    console.log("db response:", dbResponse);

    return response.redirect(`/tasks/${dbResponse.username}`);
  }
  response.redirect("/login");
});
app.get("/tasks/:username/new", async (request, response) => {
  response.sendFile(path.resolve("./client/routes/newTask.html"));
});
app.get("/signup", (request, response) => {
  console.log(request.sessionID);
  response.sendFile(path.resolve("./client/routes/signup.html"));
});
app.get("/login", (request, response) => {
  response.sendFile(path.resolve("./client/routes/login.html"));
});
app.get("/tasks/:username", (request, response) => {
  response.sendFile(path.resolve("./client/routes/tasks.html"));
});
app.get("/tasks/:username/:id", (request, response) => {
  response.sendFile(path.resolve("./client/routes/task.html"));
});
//POST REQUESTS***********************************************************************
app.post("/signup", async (request, response) => {
  const value = request.body;
  const dbResponse = await DB.createAccount(value);

  console.log("db response:", dbResponse);

  if (
    dbResponse.message ==
    "SQLITE_CONSTRAINT: UNIQUE constraint failed: account.email"
  ) {
    console.log("hey there");
    return response.status(404).send({ err: "Email is already in use." });
  }
  if (
    dbResponse.message ==
    "SQLITE_CONSTRAINT: UNIQUE constraint failed: account.username"
  ) {
    return response.status(404).send({ err: "username is already in use." });
  }
  DB.clearSession(request.cookies.session);
  const sessionResponse = await DB.createSession(
    request.sessionID,
    value.username
  );
  response.clearCookie("session");
  response.cookie("session", request.sessionID);
  response.json(value);
});
app.post("/login", async (request, response) => {
  const value = request.body;
  const dbResponse = await DB.login(value);

  console.log("db response:", dbResponse);
  if (dbResponse.message) {
    return response
      .status(404)
      .send({ err: "Your username or password is wrong" });
  }

  DB.clearSession(request.cookies.session);
  const sessionResponse = await DB.createSession(
    request.sessionID,
    value.username
  );
  response.clearCookie("session");
  response.cookie("session", request.sessionID);
  response.json(value);
});
app.post("/newTask", async (request, response) => {
  const value = request.body;
  const dbResponse = await DB.createTask(value);
  if (
    dbResponse.message ==
    "SQLITE_CONSTRAINT: UNIQUE constraint failed: task.title"
  ) {
    return response.status(404).send({ err: "title is already in use." });
  }
  console.log("db response:", dbResponse);

  response.json(value);
});
app.post("/task", async (request, response) => {
  const value = request.body;
  const dbResponse = await DB.getTask(value.title);

  console.log("db response:", dbResponse);

  response.json(dbResponse);
});
app.post("/allTasks", async (request, response) => {
  console.log("hey there amk  iam at tasks post");
  const value = request.body;
  const dbResponse = await DB.getTasks(value.username);

  console.log("db response:", dbResponse);

  response.json(dbResponse);
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
