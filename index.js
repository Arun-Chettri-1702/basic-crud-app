// and  entire crud application

import "dotenv/config";
import express from "express";

import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let teaData = [];
let nextId = 1;

//create -
app.post("/teas", (req, res) => {
  logger.info("A post request was made to a new tea");
  const { name, price } = req.body;
  const newTea = {
    id: nextId++,
    name,
    price,
  };
  teaData.push(newTea);
  res.status(201).send(newTea);
});

// read
app.get("/teas", (req, res) => {
  res.status(200).send(teaData);
});

//read Single
app.get("/teas/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));
  if (tea < 0) {
    return res.status(404).send("Tea not found");
  }
  return res.status(200).send(tea);
});

// update
app.put("/teas/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));

  if (!tea) {
    return res.status(404).send("Tea not found");
  }
  const { name, price } = req.body;
  tea.name = name;
  tea.price = price;
  res.status(200).send(tea);
});

//delete tea
app.delete("/teas/:id", (req, res) => {
  logger.warn("A delete request was made to a new tea");
  const deleteIndex = teaData.findIndex(
    (t) => t.id === parseInt(req.params.id)
  );
  if (deleteIndex < 0) {
    return res.status(404).send("Tea not found");
  }
  teaData.splice(deleteIndex, 1);
  res.status(204).send("Tea deleted");
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}...`);
});
