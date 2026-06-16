import { useEffect, useRef } from "react";

function useVoiceActivity(
  volume,
  onSilence
) {
  const silenceTimeoutRef =
    useRef(null);

  const silenceTriggeredRef =
    useRef(false);

  useEffect(() => {
    const SPEECH_THRESHOLD = 15;
    const SILENCE_DELAY = 1500;

    // User is speaking
    if (
      volume >
      SPEECH_THRESHOLD
    ) {
      silenceTriggeredRef.current =
        false;

      if (
        silenceTimeoutRef.current
      ) {
        clearTimeout(
          silenceTimeoutRef.current
        );

        silenceTimeoutRef.current =
          null;
      }

      return;
    }

    // Already triggered once
    if (
      silenceTriggeredRef.current
    ) {
      return;
    }

    // Timer already running
    if (
      silenceTimeoutRef.current
    ) {
      return;
    }

    console.log(
      "Starting silence timer..."
    );

    silenceTimeoutRef.current =
      setTimeout(() => {
        console.log(
          "SILENCE TRIGGERED"
        );

        silenceTriggeredRef.current =
          true;

        silenceTimeoutRef.current =
          null;

        onSilence();
      }, SILENCE_DELAY);

    return () => {
      // Intentionally NOT clearing here
      // because volume updates constantly
      // and would keep resetting the timer.
    };
  }, [volume, onSilence]);
}

export default useVoiceActivity;