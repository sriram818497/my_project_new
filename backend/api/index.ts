import app from "../src/app";

export default function handler(req: unknown, res: unknown) {
  return app(req as never, res as never);
}
