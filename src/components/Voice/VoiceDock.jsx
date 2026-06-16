import { useEffect, useState, useCallback } from "react";

import useWebSocket from "../hooks/useWebSocket";
import useAudioRecorder from "../hooks/useAudioRecorder";
import useMicrophone from "../hooks/useMicrophone";
import useVoiceActivity from "../hooks/useVoiceActivity";

import Waveform from "./Waveform";
import MicOrb from "./MicOrb";
import StopButton from "./StopButton";
import StatusText from "./StatusText";

import { VOICE_STATES } from "../constants/voiceStates";

function VoiceDock({ setMessages }) {
  const [voiceState, setVoiceState] = useState(VOICE_STATES.IDLE);

  const { sendMessage, sendAudioChunk, lastMessage } = useWebSocket();

  const { volume } = useMicrophone();
  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleRecordingStopped = useCallback(() => {
    console.log("Sending stop-listening");

    sendMessage({
      type: "stop-listening",
    });
  }, [sendMessage]);

  const { startRecording, stopRecording } = useAudioRecorder(
    sendAudioChunk,
    handleRecordingStopped,
  );

  const handleSilence = useCallback(() => {
    if (voiceState === VOICE_STATES.LISTENING) {
      stopRecording();

      setVoiceState(VOICE_STATES.PROCESSING);

      console.log("Silence Detected");
    }
  }, [voiceState, stopRecording]);

  useVoiceActivity(
    voiceState === VOICE_STATES.LISTENING ? volume : 0,
    handleSilence,
  );

  useEffect(() => {
    const clearHistory = () => {
      sendMessage({
        type: "clear-history",
      });

      console.log("History Cleared");
    };

    window.addEventListener("clear-nebula-history", clearHistory);

    return () => {
      window.removeEventListener("clear-nebula-history", clearHistory);
    };
  }, [sendMessage]);

  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case "listening":
        setVoiceState(VOICE_STATES.LISTENING);
        break;

      case "processing":
        setVoiceState(VOICE_STATES.PROCESSING);
        break;

      case "transcript":
        console.log("Transcript:", lastMessage.transcript);

        if (lastMessage.transcript) {
          setMessages((prev) => [
            ...prev,
            {
              role: "user",
              text: lastMessage.transcript,
              time: getTime(),
            },
          ]);
        }

        break;

      case "assistant-response": {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: lastMessage.message,
            time: getTime(),
          },
        ]);
        console.log("AI Response:", lastMessage.message);

        setVoiceState(VOICE_STATES.SPEAKING);

        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(lastMessage.message);

        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onend = () => {
          console.log("Speech Finished");

          setVoiceState(VOICE_STATES.IDLE);
        };

        speechSynthesis.speak(utterance);

        break;
      }

      case "idle":
        setVoiceState(VOICE_STATES.IDLE);
        break;

      default:
        break;
    }
  }, [lastMessage]);

  const handleMicClick = () => {
    if (voiceState === VOICE_STATES.IDLE) {
      startRecording();

      sendMessage({
        type: "start-listening",
      });
    }
  };

  const handleManualStop = () => {
    speechSynthesis.cancel();

    setVoiceState(VOICE_STATES.IDLE);

    console.log("Assistant Interrupted");
  };

  return (
    <div className="voice-dock">
      <div className="voice-left">
        <StatusText state={voiceState} />

        {voiceState !== VOICE_STATES.PROCESSING && (
          <Waveform volume={volume} state={voiceState} />
        )}
      </div>

      <MicOrb state={voiceState} onMicClick={handleMicClick} />

      <StopButton onStop={handleManualStop} />
    </div>
  );
}

export default VoiceDock;
