import express from "express";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db";
import { errorHandler } from "./middleware/errorHandler";
import { protect } from "./middleware/auth.middleware";
import authRouter from "./router/route";
import { getOpenApiDocumentation } from "./docs/openapi";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Swagger documentation (public — mounted before auth guard)
const openApiDocument = getOpenApiDocumentation();
app.get("/api/v1/docs/json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(openApiDocument);
});
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Global Auth Middleware - protects all endpoints except excluded ones (login/register/docs)
app.use(protect);

// Add your routes here
app.use("/api/v1/auth", authRouter);

// Global Error Handler should be the last middleware
app.use(errorHandler);

// Connect DB first, then start server
connectDB().then(() => {
  app.listen(Bun.env.PORT ?? 5000, () => {
    console.log(`Server running on port ${Bun.env.PORT ?? 5000}`);
  });
});

export default app;