import { useRef } from "react";

function useAudioRecorder(sendAudioChunk) {
    const mediaRecorderRef =
        useRef(null);

    const startRecording =
        async () => {
            try {
                const stream =
                    await navigator.mediaDevices.getUserMedia({
                        audio: true,
                    });

                const mediaRecorder =
                    new MediaRecorder(
                        stream
                    );

                mediaRecorderRef.current =
                    mediaRecorder;

                mediaRecorder.ondataavailable =
                    (event) => {
                        if (
                            event.data &&
                            event.data.size > 0
                        ) {
                            sendAudioChunk(
                                event.data
                            );
                        }
                    };

                mediaRecorder.start(
                    250
                );

                console.log(
                    "Recording Started"
                );
            } catch (error) {
                console.error(
                    "Recording Error:",
                    error
                );
            }
        };

    const stopRecording = () => {
        if (
            mediaRecorderRef.current
        ) {
            mediaRecorderRef.current.stop();

            console.log(
                "Recording Stopped"
            );
        }
    };

    return {
        startRecording,
        stopRecording,
    };
}

export default useAudioRecorder;