// Load env config
require("dotenv").config();

const fetch = require("node-fetch");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3001;

// Configurations
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to bot forward");
});

app.get("/test", (req, res) => {
  res.send("Test ok");
});

app.post("/post", (req, res) => {
  res.send("Post ok");
});

app.post("/", async (req, res) => {
  try {
    // console.log("BODY", req.body);
    // console.log(process.env.HEADER_TOKEN);
    // console.log(process.env.URL_FORWARD);
    await fetch(process.env.URL_FORWARD, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "HEADER-TOKEN": process.env.HEADER_TOKEN,
      },
      body: JSON.stringify(req.body),
    });

    res.send("Forward ok");
  } catch (error) {
    console.error(error);
    res.send("Forward fail");
  }
});

// Listening
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
