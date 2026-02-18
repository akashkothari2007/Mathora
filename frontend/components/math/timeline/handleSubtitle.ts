type Props = {
    subtitle: string;
    speakSubtitle: string;
    setSubtitle: (subtitle: string) => void;
    audioRef: React.RefObject<HTMLAudioElement | null>;
}

const WORDS_PER_MINUTE = 150;
const CHARS_PER_WORD = 5;
const AUDIO_START_TIMEOUT = 300;

export type AudioTimingResult = {
    audioStarted: boolean;
    estimatedDuration: number; // milliseconds
}

function estimateTTSDuration(text: string): number {
    const wordCount = text.length / CHARS_PER_WORD;
    const minutes = wordCount / WORDS_PER_MINUTE;
    return Math.ceil(minutes * 60 * 1000); // Convert to milliseconds
}

export async function handleSubtitle({ subtitle, speakSubtitle, setSubtitle, audioRef }: Props): Promise<AudioTimingResult> {
    setSubtitle(subtitle);
    const textToSpeak = speakSubtitle || subtitle;
    if (!textToSpeak) {
        return { audioStarted: false, estimatedDuration: 0 };
    }
    
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
            return {
                audioStarted: true,
                estimatedDuration: estimateTTSDuration(textToSpeak)
            };
        }
        
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        
        // Wait for metadata to load to get duration
        const durationPromise = new Promise<number>((resolve) => {
            const onLoadedMetadata = () => {
                audio.removeEventListener('loadedmetadata', onLoadedMetadata);
                const duration = audio.duration;
                if (duration && isFinite(duration)) {
                    resolve(duration * 1000); // Convert to milliseconds
                } else {
                    resolve(estimateTTSDuration(textToSpeak));
                }
            };
            
            if (audio.readyState >= 1) {
                // Metadata already loaded
                const duration = audio.duration;
                if (duration && isFinite(duration)) {
                    resolve(duration * 1000);
                } else {
                    resolve(estimateTTSDuration(textToSpeak));
                }
            } else {
                audio.addEventListener('loadedmetadata', onLoadedMetadata);
                // Fallback timeout
                setTimeout(() => {
                    audio.removeEventListener('loadedmetadata', onLoadedMetadata);
                    resolve(estimateTTSDuration(textToSpeak));
                }, 1000);
            }
        });
        
        // Wait for audio to start playing
        const playPromise = audio.play().catch((error) => {
            console.error('Audio play failed:', error);
            speakWithBrowserTTS(textToSpeak);
            return Promise.resolve();
        });
        
        // Wait for play to start (or timeout)
        const startTimeout = new Promise<void>((resolve) => {
            setTimeout(() => resolve(), AUDIO_START_TIMEOUT);
        });
        
        await Promise.race([playPromise, startTimeout]);
        
        const duration = await durationPromise;
        
        return {
            audioStarted: true,
            estimatedDuration: duration
        };
        
    } catch (error) {
        speakWithBrowserTTS(textToSpeak);
        return {
            audioStarted: true,
            estimatedDuration: estimateTTSDuration(textToSpeak)
        };
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