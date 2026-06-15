import { useEffect, useRef } from "react";

function useVoiceActivity(
    volume,
    onSilence
) {
    const silenceTimerRef =
        useRef(null);

    const noiseSamplesRef =
        useRef([]);

    const thresholdRef =
        useRef(12);

    useEffect(() => {
        // Collect room noise samples
        if (
            noiseSamplesRef.current.length < 40
        ) {
            noiseSamplesRef.current.push(
                volume
            );

            const averageNoise =
                noiseSamplesRef.current.reduce(
                    (sum, value) =>
                        sum + value,
                    0
                ) /
                noiseSamplesRef.current.length;

            thresholdRef.current =
                averageNoise + 10;
            console.log(
                "Adaptive Threshold:",
                thresholdRef.current
            );
            return;
        }

        const SPEECH_THRESHOLD =
            thresholdRef.current;

        const SILENCE_DELAY = 2000;

        if (
            volume > SPEECH_THRESHOLD
        ) {
            clearTimeout(
                silenceTimerRef.current
            );

            return;
        }

        silenceTimerRef.current =
            setTimeout(() => {
                onSilence();
            }, SILENCE_DELAY);

        return () => {
            clearTimeout(
                silenceTimerRef.current
            );
        };
    }, [volume, onSilence]);
}

export default useVoiceActivity;