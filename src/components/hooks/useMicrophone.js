import { useEffect, useRef, useState } from "react";

function useMicrophone() {
    const [volume, setVolume] = useState(0);

    const analyserRef = useRef(null);
    const audioContextRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        let animationFrame;

        const initializeMic = async () => {
            try {
                const stream =
                    await navigator.mediaDevices.getUserMedia({
                        audio: true,
                    });

                streamRef.current = stream;

                const audioContext = new AudioContext();

                const analyser =
                    audioContext.createAnalyser();

                analyser.fftSize = 256;

                const source =
                    audioContext.createMediaStreamSource(
                        stream
                    );

                source.connect(analyser);

                const dataArray =
                    new Uint8Array(
                        analyser.frequencyBinCount
                    );

                analyserRef.current = analyser;
                audioContextRef.current = audioContext;

                const updateVolume = () => {
                    analyser.getByteFrequencyData(
                        dataArray
                    );

                    const average =
                        dataArray.reduce(
                            (sum, value) => sum + value,
                            0
                        ) / dataArray.length;
                    // console.log("Volume:", Math.round(average));
                    setVolume(Math.round(average));

                    animationFrame =
                        requestAnimationFrame(
                            updateVolume
                        );
                };

                updateVolume();
            } catch (error) {
                console.error(
                    "Microphone access denied:",
                    error
                );
            }
        };

        initializeMic();

        return () => {
            cancelAnimationFrame(
                animationFrame
            );

            streamRef.current
                ?.getTracks()
                .forEach((track) => track.stop());

            audioContextRef.current?.close();
        };
    }, []);

    return {
        volume,
        // analyser: analyserRef.current,
        // audioContext: audioContextRef.current,
        // stream: streamRef.current,
    };
}

export default useMicrophone;