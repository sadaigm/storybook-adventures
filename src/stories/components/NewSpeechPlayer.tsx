import React, { useState, useEffect, useRef } from "react";
import { Button, Space } from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";

interface SpeechPlayerProps {
  text: string;
}

const NewSpeechPlayer: React.FC<SpeechPlayerProps> = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showStop, setshowStop] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]); // State to hold available voices
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );

  useEffect(() => {
    const loadVoices = () => {
      console.log("Loading available voices...");
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      console.log("Available voices:", availableVoices);

      if (availableVoices.length === 0) {
        console.log("No voices available.");
      }
    };

    // Load voices when the page loads
    loadVoices();

    // Check if voices are dynamically loaded after a delay (in case they're not available immediately)
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1; // Adjust speech speed (1 is the default)
    u.pitch = 1; // Adjust pitch (1 is the default)
    u.volume = 1; // Adjust volume (1 is the max)
    u.lang = "en-US"; // Set the language to English
    u.onend = () =>{
      console.log("end");
      setIsPlaying(false);
      setIsPaused(false);
      setshowStop(false);
    }

    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [text, voices.length]);

  const handlePlayPause = () => {
    const synth = window.speechSynthesis;
    setshowStop(true);
    if (isPlaying) {
      // If it's already playing, pause it
      synth.pause();
      setIsPlaying(false);
      setIsPaused(true);
    } else if (isPaused) {
      // If it's paused, resume it
      synth.resume();
      setIsPlaying(true);
      setIsPaused(false);
    } else if (utterance) {
      // If it's not playing, start speaking
      if(utterance.voice === null){
      const englishVoice = voices.find((voice) => voice.lang === "en-US");
      if ( englishVoice) {
        utterance.voice = englishVoice;
      } else {
        utterance.voice = voices[0];
      }
    }
      synth.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    setshowStop(false);
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="speech-player">
      <Space>
        <Button
         color="default" variant="solid"
          icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          onClick={handlePlayPause}
        >
          {isPlaying ? "Pause" : isPaused ? "Resume" : "Play"}
        </Button>
        {showStop && (
          <Button color="danger" variant="solid" icon={<StopOutlined />} onClick={handleStop}>
            Stop
          </Button>
        )}
      </Space>
    </div>
  );
};

export default NewSpeechPlayer;
