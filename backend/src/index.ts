import express from "express";
import timelineRoute from "./routes/timeline";

const app = express();
app.use(express.json());

app.use("/timeline", timelineRoute);

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
