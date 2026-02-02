import { ElevenLabsClient, play } from "@elevenlabs/elevenlabs-js";
import "dotenv/config";
const VOICE_ID = "onwK4e9ZLuTAKqWW03F9";

export async function convertTextToSpeech(text: string) {
    if (!process.env.ELEVENLABS_API_KEY) {
        throw new Error("ELEVENLABS_API_KEY is not set");
    }

    const elevenlabs = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY,
    });

    const audio = await elevenlabs.textToDialogue.convert({
        inputs: [
        { text: text, voiceId: VOICE_ID }
        ],
    });

  return audio;
}



