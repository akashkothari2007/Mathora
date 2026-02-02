import { Router } from "express";
import { convertTextToSpeech } from "./services/speechToText";
import { Readable } from "stream";

const router = Router();

router.post("/convert", async (req, res) => {
    console.log("[Audio] Converting text to speech");
    const { text } = req.body;

    const webStream = await convertTextToSpeech(text);

    res.setHeader("Content-Type", "audio/mpeg");

    const nodeStream = Readable.fromWeb(webStream as any);
    nodeStream.pipe(res);
});

export default router;