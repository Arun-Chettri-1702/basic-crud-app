// and  entire crud application

import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let teaData = [];
let nextId = 1;

//create -
app.post("/teas", (req, res) => {
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
  const deleteIndex = teaData.findIndex(
    (t) => t.id === parseInt(req.params.id)
  );
  if (!deleteIndex) {
    return res.status(404).send("Tea not found");
  }
  teaData.splice(deleteIndex, 1);
  res.status(200).send("Tea deleted");
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}...`);
});
