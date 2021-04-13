const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const htmlToPDF = require("./src/helpers/htmlToPDF");

const app = express();
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });

app.use(express.json());
app.use(cors());
app.use(apiLimiter);

app.get("/", (req, res) => {
  res.send("Welcome to Puppet My HTML!").status(200);
});

app.post("/create-pdf", async (req, res) => {
  try {
    const { pdfFile } = await htmlToPDF(req.body);
    res.contentType("application/pdf");
    res.send(pdfFile).status(201);
  } catch (error) {
    res.send(error).status(400);
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`SERVER LISTENING ON PORT:${PORT}`));
