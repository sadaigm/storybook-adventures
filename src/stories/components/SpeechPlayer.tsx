import React, { useState, useEffect, useRef } from "react";
import { Button } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";

interface SpeechPlayerProps {
  text: string;
}

const SpeechPlayer: React.FC<SpeechPlayerProps> = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]); // State to hold available voices
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentTextIndex = useRef<number>(0); // Track position in text

  useEffect(() => {
    console.log(currentTextIndex);

  },[currentTextIndex])

  useEffect(() => {
    // Create a new SpeechSynthesisUtterance once the component is mounted
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1; // Adjust speech speed (1 is the default)
    utterance.pitch = 1; // Adjust pitch (1 is the default)
    utterance.volume = 1; // Adjust volume (1 is the max)
    utterance.lang = "en-US"; // Set the language to English
    speechRef.current = utterance;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      if (availableVoices.length === 0) {
        console.log("No voices available.");
      }
    };

    // Load voices when the page loads
    loadVoices();

    // Check if voices are dynamically loaded after a delay (in case they're not available immediately)
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Cleanup on component unmount
    return () => {
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text]); // Rerun effect when text changes

  useEffect(() => {
    // Set up the beforeunload event to cancel speech when leaving the page
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel();
    };

    // Add the beforeunload event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handlePlayPause = () => {
    if (isPlaying) {
      // Pause the speech
      if (speechRef.current) {
        window.speechSynthesis.cancel(); // Cancel speech
        setIsPlaying(false);
      }
    } else {
      // Check if SpeechSynthesis is supported
      if (!window.speechSynthesis) {
        console.error("SpeechSynthesis not supported in this browser.");
        return;
      }

      if (!text || text.trim() === "") {
        console.error("No text provided for speech.");
        return;
      }

      // Cancel any ongoing speech before starting a new one
      window.speechSynthesis.cancel();

      // Use the created utterance and find an English voice
      const utterance = speechRef.current;
      if (utterance) {
        const englishVoice = voices.find(voice => voice.lang === "en-US");

        if (englishVoice) {
          utterance.voice = englishVoice;
        } else {
          // Log a warning and try using the default voice if no English voice is available
          utterance.voice = voices.find(voice => voice.default === true) || voices[0];
        }

        // Start speaking from the beginning
        window.speechSynthesis.speak(utterance);

        // Track speech progress using the boundary event
        utterance.onboundary = (event) => {
          currentTextIndex.current = event.charIndex;
        };

        // Handle when speech ends
        utterance.onend = () => {
          setIsPlaying(false); // Reset play state when speech ends
        };

        // Handle error
        utterance.onerror = (event) => {
          setIsPlaying(false);
        };

        // Handle when speech starts
        utterance.onstart = () => {
          setIsPlaying(true);
        };
      }
    }
  };

  return (
    <div className="speech-player">
      <Button
        type="primary"
        icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
        onClick={handlePlayPause}
      >
        {isPlaying ? "Pause" : "Play"}
      </Button>
    </div>
  );
};

export default SpeechPlayer;
