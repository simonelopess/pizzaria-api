import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";

import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'fs';


import { router } from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

const swaggerDocument = YAML.parse(
  fs.readFileSync('./swagger.yaml', 'utf8')
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof Error) {
    return res.status(400).json({
      error: error.message,
    });
  }

  return res.status(500).json({
    error: "Internal server error!",
  });
});

const PORT = process.env.PORT || 33333;

app.listen(PORT, () => {
  console.log("Server running on...", PORT);
});
