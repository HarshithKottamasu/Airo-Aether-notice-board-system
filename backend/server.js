const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AIRO-AETHER Notice Board Backend Running");
});

app.listen(7000, () => {
  console.log("Server running on port 7000");
});