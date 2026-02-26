import jwt, { JwtHeader } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { SUPABASE_URL } from "../db/supabase";

const client = jwksClient({
  jwksUri: `${SUPABASE_URL}/auth/v1/keys`,
});

function getKey(header: JwtHeader, callback: any) {
  if (!header.kid) {
    callback(new Error("No KID found in token"), null);
    return;
  }

  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err, null);
      return;
    }

    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export function verifyToken(req: any, res: any, next: any) {
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
      algorithms: ["RS256"],
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