const rateLimitStore = {};
const logs = [];

function wafMiddleware(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  const input =
    JSON.stringify(req.body) +
    JSON.stringify(req.query) +
    JSON.stringify(req.params);

  // ===== RATE LIMIT =====
  if (!rateLimitStore[ip]) rateLimitStore[ip] = [];

  rateLimitStore[ip] = rateLimitStore[ip].filter(
    (time) => now - time < 10000, // 10 sec window
  );

  rateLimitStore[ip].push(now);

  if (rateLimitStore[ip].length > 10) {
    logRequest(req, "BLOCKED", "Rate limit exceeded");
    return res.status(429).json({ message: "Too many requests" });
  }

  // ===== SQL INJECTION =====
  // ===== SQL INJECTION =====
  const sqlPattern = /(\bOR\b|\bAND\b).*(=)|(--|;|#)/i;

  if (sqlPattern.test(input)) {
    logRequest(req, "BLOCKED", "SQL Injection");
    return res.status(403).json({
      message: "Blocked: SQL Injection",
    });
  }

  // ===== XSS =====
  const xssPattern =
    /(<script.*?>.*?<\/script>|javascript:|on\w+=|<img.*?>|<iframe.*?>)/i;

  if (xssPattern.test(input)) {
    logRequest(req, "BLOCKED", "XSS Attack");

    return res.status(403).json({
      message: "Blocked: XSS Attack",
    });
  }

  // ===== COMMAND INJECTION =====
  const cmdPattern =
    /(;|&&|\|\||\||`|\$\(|\$\{|>|>>|\n|\r|\b(cat|ls|pwd|whoami|curl|wget|chmod|chown|rm|mv|cp|touch|uname|id|ps|netstat)\b)/i;

  if (cmdPattern.test(input)) {
    logRequest(req, "BLOCKED", "Command Injection");

    return res.status(403).json({
      message: "Blocked: Command Injection",
    });
  }

  logRequest(req, "ALLOWED", "Clean");
  next();
}

// ===== LOGGER =====
function logRequest(req, status, reason) {
  const log = {
    time: new Date().toISOString(),
    ip: req.ip,
    method: req.method,
    path: req.originalUrl,
    status,
    reason,
  };

  logs.push(log);
  console.log(log);
}

module.exports = { wafMiddleware, logs };
