const express = require("express");
const cookieParser = require("cookie-parser"); // Add this line to use cookie-parser
const app = express();

const Connection = require("./database/db");
const authRoute = require("./route/route");
const tokenRoute = require("./route/tokenRoute"); // Add this line to import the new route

const PORT = 8000;

app.use(express.json());
app.use(cookieParser()); // Add this line to use cookie-parser

// Debugging middleware to log requests
app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  console.log('Request Body:', req.body);
  next();
});

Connection();

app.use("/api", authRoute);
app.use("/api", tokenRoute); // Add this line to use the new route

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
