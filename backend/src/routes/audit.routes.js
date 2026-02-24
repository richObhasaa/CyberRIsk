const express = require("express");
const router = express.Router();

const { verifyToken } = require("../src/auth/verifyToken");

// TEST protected route
router.get("/protected", verifyToken, async (req, res) => {
  res.json({
    message: "Authorized",
    user: req.user,
  });
});

// Example audit endpoint
router.post("/audit", verifyToken, async (req, res) => {
  try {
    const { data } = req.body;

    // contoh dummy response
    res.json({
      message: "Audit processed",
      input: data,
      user: req.user.email,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;