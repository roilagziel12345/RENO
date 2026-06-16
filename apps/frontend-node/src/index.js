const express = require("express");

const app = express();

app.get("/health", (_req, res) => {
  res.json({ service: "frontend-node", status: "ok" });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`frontend-node listening on ${port}`);
  });
}

module.exports = app;
