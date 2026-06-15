import { Mic } from "lucide-react";

function MicOrb({ state, onMicClick }) {
  return (
    <div
      className={`mic-wrapper ${state}`}
      onClick={onMicClick}
      role="button"
      tabIndex={0}
    >
      <div className="mic-orb">
        <Mic size={52} />
      </div>
    </div>
  );
}

export default MicOrb;
