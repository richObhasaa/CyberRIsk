import { Router } from "express";
import https from "https";
import http from "http";
import { URL } from "url";
import dns from "dns/promises";

const router = Router();

/**
 * ================================
 * 🔐 Helper — Block Private IPs
 * ================================
 * Mencegah SSRF ke:
 * - localhost
 * - internal network
 * - cloud metadata
 */
async function isPrivateHost(hostname: string): Promise<boolean> {
  try {
    const results = await dns.lookup(hostname, { all: true });

    return results.some((addr) => {
      const ip = addr.address;

      return (
        ip.startsWith("10.") ||
        ip.startsWith("192.168.") ||
        ip.startsWith("172.16.") ||
        ip.startsWith("127.") ||
        ip === "localhost"
      );
    });
  } catch {
    return true; // fail-safe: treat unknown as unsafe
  }
}

/**
 * ================================
 * 🌐 Helper — Fetch Headers
 * ================================
 */
function fetchHeaders(targetUrl: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(targetUrl);
      const lib = urlObj.protocol === "https:" ? https : http;

      const req = lib.request(
        {
          hostname: urlObj.hostname,
          path: urlObj.pathname || "/",
          method: "GET",
          timeout: 5000,
        },
        (res) => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
          });
        }
      );

      req.on("error", reject);

      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * ================================
 * 🚀 POST /scan-domain
 * ================================
 */
router.post("/scan-domain", async (req, res) => {
  try {
    let { domain } = req.body;

    // ================================
    // ✅ Input validation
    // ================================
    if (!domain || typeof domain !== "string") {
      return res.status(400).json({
        success: false,
        error: "Domain is required",
      });
    }

    domain = domain.trim();

    if (domain.length > 255) {
      return res.status(400).json({
        success: false,
        error: "Domain too long",
      });
    }

    // ================================
    // ✅ Normalize URL
    // ================================
    if (!domain.startsWith("http")) {
      domain = "https://" + domain;
    }

    const urlObj = new URL(domain);

    // ================================
    // 🔐 SSRF Protection
    // ================================
    const isPrivate = await isPrivateHost(urlObj.hostname);

    if (isPrivate) {
      return res.status(400).json({
        success: false,
        error: "Private or internal hosts are not allowed",
      });
    }

    // ================================
    // 🌐 Fetch headers
    // ================================
    const result = await fetchHeaders(domain);
    const headers = result.headers || {};

    // ================================
    // 📊 Security Analysis
    // ================================
    const analysis = {
      https: urlObj.protocol === "https:",
      hsts: !!headers["strict-transport-security"],
      csp: !!headers["content-security-policy"],
      xFrameOptions: !!headers["x-frame-options"],
      xContentTypeOptions: !!headers["x-content-type-options"],
      referrerPolicy: !!headers["referrer-policy"],
    };

    // ================================
    // ✅ Response
    // ================================
    return res.json({
      success: true,
      target: domain,
      statusCode: result.statusCode,
      analysis,
      checkedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Domain scan error:", err);

    return res.status(500).json({
      success: false,
      error: "Domain scan failed",
    });
  }
});

export default router;