import { useEffect, useState } from "react";

import useWebSocket from "../hooks/useWebSocket";
import useAudioRecorder from "../hooks/useAudioRecorder";
import useMicrophone from "../hooks/useMicrophone";
import useVoiceActivity from "../hooks/useVoiceActivity";

import Waveform from "./Waveform";
import MicOrb from "./MicOrb";
import StopButton from "./StopButton";
import StatusText from "./StatusText";

import { VOICE_STATES } from "../constants/voiceStates";

function VoiceDock() {
  const [voiceState, setVoiceState] = useState(VOICE_STATES.IDLE);

  const { sendMessage, sendAudioChunk, lastMessage } = useWebSocket();

  const { volume } = useMicrophone();

  const { startRecording, stopRecording } = useAudioRecorder(sendAudioChunk);

  const handleSilence = () => {
    if (voiceState === VOICE_STATES.LISTENING) {
      stopRecording();

      setVoiceState(VOICE_STATES.PROCESSING);

      console.log("Silence Detected");
    }
  };

  // ENERGY VAD
  useVoiceActivity(volume, handleSilence);

  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case "listening":
        setVoiceState(VOICE_STATES.LISTENING);
        break;

      case "processing":
        setVoiceState(VOICE_STATES.PROCESSING);
        break;

      case "speaking":
        setVoiceState(VOICE_STATES.SPEAKING);
        break;

      case "idle":
        stopRecording();

        setVoiceState(VOICE_STATES.IDLE);
        break;

      default:
        break;
    }
  }, [lastMessage, stopRecording]);

  const handleMicClick = () => {
    if (voiceState === VOICE_STATES.IDLE) {
      startRecording();

      sendMessage({
        type: "start-listening",
      });
    }
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

      <StopButton />
    </div>
  );
}

export default VoiceDock;
