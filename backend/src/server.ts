import app from "./app";
import { env } from "./config/env";

const server = app.listen(env.PORT, () => {
  console.log(`Backend server listening on http://localhost:${env.PORT}`);
});

const shutdownSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

shutdownSignals.forEach((signal) => {
  process.on(signal, () => {
    server.close(() => {
      process.exit(0);
    });
  });
});

