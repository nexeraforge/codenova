import express from "express";
import app from "./api-server";
import path from "path";

const PORT = 3000;

async function bootstrap() {
  // Vite development middleware vs Static build files
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Only start listening if NOT on Vercel environment (Vercel uses the serverless export directly)
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`CodeNova full-stack server running on http://localhost:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  bootstrap();
}

export default app;
