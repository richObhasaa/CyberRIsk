require("dotenv").config();
const express = require("express");
const cors = require("cors");

const auditRoutes = require("./routes/audit.routes");

const app = express();

app.use(cors({
    origin: "localhost:3000",
    credentials: true,
}));

app.use(cors());
app.use(express.json());

app.use("/api/audit", auditRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// entry point for the server, sets up Express, middleware, and routes, and starts the server on the specified port.
// routing center