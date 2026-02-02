import express from "express";
import cors from "cors";
import timelineRoute from "./routes/timeline";    
import audioRoute from "./routes/audio";
import dotenv from "dotenv";
dotenv.config();



const app = express();
app.use(cors());
app.use(express.json());

app.use("/timeline", timelineRoute);
app.use("/audio", audioRoute);

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
