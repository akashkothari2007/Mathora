const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY!;
const AZURE_REGION = process.env.AZURE_SPEECH_REGION!; 

const VOICE = "en-KE-ChilembaNeural"; 

export async function convertTextToSpeech(text: string): Promise<ReadableStream<Uint8Array>>{
  if (!AZURE_SPEECH_KEY || !AZURE_REGION) {
    throw new Error("Azure Speech env vars missing");
  }

  const ssml = `
<speak version="1.0"
       xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="http://www.w3.org/2001/mstts"
       xml:lang="en-US">
  <voice name="${VOICE}">
    <mstts:express-as style="assistant">
      ${text}
    </mstts:express-as>
  </voice>
</speak>
`.trim();

  const res = await fetch(
    `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "Mathora",
      },
      body: ssml,
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Azure TTS failed: ${res.status} ${err}`);
  }

  // IMPORTANT: return raw audio stream (not JSON)
  return res.body!;
}



