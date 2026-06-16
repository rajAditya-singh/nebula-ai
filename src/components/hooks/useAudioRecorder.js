import {
    useRef,
    useCallback,
} from "react";

function useAudioRecorder(
    sendAudioChunk,
    onRecordingStopped
) {
    const mediaRecorderRef = useRef(null);

    const pendingUploadsRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream =
                await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });

            const mediaRecorder =
                new MediaRecorder(stream);

            mediaRecorderRef.current =
                mediaRecorder;

            pendingUploadsRef.current = [];

            mediaRecorder.ondataavailable =
                (event) => {
                    if (
                        event.data &&
                        event.data.size > 0
                    ) {
                        const uploadPromise =
                            sendAudioChunk(
                                event.data
                            );

                        pendingUploadsRef.current.push(
                            uploadPromise
                        );
                    }
                };

            mediaRecorder.onstop =
                async () => {
                    console.log(
                        "MediaRecorder Finished"
                    );

                    try {
                        await Promise.all(
                            pendingUploadsRef.current
                        );

                        console.log(
                            "All audio chunks sent"
                        );
                    } catch (error) {
                        console.error(
                            "Chunk upload error:",
                            error
                        );
                    }

                    if (
                        onRecordingStopped
                    ) {
                        onRecordingStopped();
                    }

                    stream
                        .getTracks()
                        .forEach((track) =>
                            track.stop()
                        );
                };

            mediaRecorder.start(250);

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

    const stopRecording =
        useCallback(() => {
            if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current
                    .state !==
                "inactive"
            ) {
                mediaRecorderRef.current.stop();

                console.log(
                    "Recording Stopped"
                );
            }
        }, []);

    return {
        startRecording,
        stopRecording,
    };
}

export default useAudioRecorder;