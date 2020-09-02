const express = require("express");
const bodyParser = require("body-parser");
const app = require("./app.js");
const port = process.env.APP_PORT || 8080;

const expressApp = express();

expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());

function verifyRequest(req, res, next) {
  if (app.verifySignature(req.headers["x-locust-signature"], req.body)) {
    next();
  } else {
    res.sendStatus(403);
  }
}

expressApp.post("/init", verifyRequest, async (req, res) => {
  console.log("Hit endpoint", req);
  res.setHeader("Content-Type", "application/json");
  const data = req.body;
  let result = await app.init(data);
  res.end(JSON.stringify(result));
});

expressApp.listen(port, () => {
  console.log(`Bot Action endpoint is listening on ${port}`);
});

expressApp.get("", (req, res) => {
  res.send("Bot Action endpoint running!");
});
