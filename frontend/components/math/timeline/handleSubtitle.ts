type Props = {
    subtitle: string;
    speakSubtitle: string;
    setSubtitle: (subtitle: string) => void;
    audioRef: React.RefObject<HTMLAudioElement | null>;
}

export async function handleSubtitle({ subtitle, speakSubtitle, setSubtitle, audioRef }: Props) {
    setSubtitle(subtitle);
    const textToSpeak = speakSubtitle || subtitle;
    if (!textToSpeak) return;
    try {

        const res = await fetch("http://localhost:3001/audio/convert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: textToSpeak }),
        });
        if (!res.ok) {
            speakWithBrowserTTS(textToSpeak);
            throw new Error("Failed to convert text to speech");
        }
        
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        audioRef.current = new Audio(url);
        try {
            await audioRef.current.play();
        } catch (error) {
            speakWithBrowserTTS(textToSpeak);
            console.error(error);
        }
        
    } catch (error) {
        speakWithBrowserTTS(textToSpeak);
        console.error(error);
    }
}

export function speakWithBrowserTTS(text: string) {
  if (!text) return;
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1.0;
  u.pitch = 1.0;
  u.volume = 1.0;

  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(v => /en/i.test(v.lang)) ?? voices[0];
  if (preferred) u.voice = preferred;

  speechSynthesis.cancel(); 
  speechSynthesis.speak(u);
}



export async function unlockAudio() {
  
    try {
      const a = new Audio();
      a.src = "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAA";
      a.volume = 0;
      await a.play();
      a.pause();
      return true;
    } catch {
      return false;
    }
  }