// IMPORTANT: Import instrumentation first before any other imports
import "./instrumentation.js";
import express from "express";
import logger from "./logger.js";

const app = express();

// Add JSON body parser middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

app.get("/", (req, res) => {
  logger.info("Root endpoint accessed");
  return res.json({ msg: "Hey There" });
});

// Example endpoint with different log levels
app.get("/api/health", (req, res) => {
  logger.debug("Health check endpoint called");
  return res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.get("/api/error", (req, res) => {
  logger.error("Error endpoint accessed - simulating an error", {
    endpoint: "/api/error",
    errorType: "simulation",
  });
  return res.status(500).json({ error: "Something went wrong!" });
});

app.post("/api/data", (req, res) => {
  logger.info("Data received", { body: req.body });
  return res.json({ received: true, data: req.body });
});

app.listen(process.env.PORT ?? 3000, () => {
  logger.info("Server is running on port 9000", {
    port: process.env.PORT ?? 3000,
    environment: process.env.NODE_ENV || "development",
    serviceName: process.env.OTEL_SERVICE_NAME || "my-express",
  });
});
