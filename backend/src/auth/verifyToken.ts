const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const SUPABASE_URL = process.env.SUPABASE_URL;

const client = jwksClient({
  jwksUri: `${SUPABASE_URL}/auth/v1/keys`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err, null);
      return;
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    getKey,
    {
      audience: "authenticated",
      issuer: `${SUPABASE_URL}/auth/v1`,
    },
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }

      req.user = decoded;
      next();
    }
  );
}

module.exports = { verifyToken };