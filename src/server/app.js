require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");
const cors = require("cors");

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/", express.static(path.join(__dirname, "../frontend")));

//API CALL
app.get("/apod", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    console.log(err);
  }
});

//rover api for rovers
app.get("/rovers/:id", async (req, res) => {
  try {
    let name = req.params.id;
    let data = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?sol=1000&camera=fhaz&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ data });
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => console.log(`server is listening at ${PORT}`));
