import { VOICE_STATES } from "../constants/voiceStates";

function StatusText({ state }) {
  let text = "";

  switch (state) {
    case VOICE_STATES.IDLE:
      text = "Tap to Speak";
      break;

    case VOICE_STATES.LISTENING:
      text = "Listening...";
      break;

    case VOICE_STATES.PROCESSING:
      text = "Thinking...";
      break;

    case VOICE_STATES.SPEAKING:
      text = "Speaking...";
      break;

    default:
      text = "Tap to Speak";
  }

  return <h2 className="status-text">{text}</h2>;
}

export default StatusText;
