import express from "express";
const app = express();
import { createProxyMiddleware } from "http-proxy-middleware";
import "dotenv/config";

import { services } from "./services.js";
import { limiter } from "./middleware/rateLimiter.js";

services.forEach(({ route, target }) => {
  // Proxy options
  const proxyOptions = {
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${route}`]: "",
    },
  };

  // Apply rate limiting and timeout middleware before proxying
  app.use(route, limiter, createProxyMiddleware(proxyOptions));
});

export default app;
