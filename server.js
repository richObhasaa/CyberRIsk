require("dotenv").config();
const express = require("express");
const cors = require("cors");

const auditRoutes = require("./routes/audit.routes");
const assessmentRoutes = require("./backend/src/assessment/assessment.routes").default;

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

app.use("/api/audit", auditRoutes);
app.use("/api/assessment", assessmentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});