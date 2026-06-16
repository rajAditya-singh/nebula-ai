const WebSocket = require("ws");
const fs = require("fs");

const {
    handleAudioChunk,
    saveRecording,
} = require("../audio/audioHandler");

const {
    transcribeAudio,
} = require("../stt/sttHandler");

const {
    generateResponse,
} = require("../llm/llmHandler");

function initializeWebSocket(server) {
    const wss = new WebSocket.Server({
        server,
    });

    wss.on("connection", (ws) => {
        console.log("Client Connected");

        const conversationHistory = [
            {
                role: "system",
                content:
                    "You are Nebula, a helpful AI voice assistant. Give concise conversational answers.",
            },
        ];

        ws.send(
            JSON.stringify({
                type: "connected",
                message:
                    "Nebula Socket Connected",
            })
        );

        ws.on(
            "message",
            async (message) => {
                let data;

                try {
                    data = JSON.parse(
                        message
                    );
                } catch {
                    handleAudioChunk(
                        message
                    );

                    return;
                }

                console.log(
                    "Received:",
                    data
                );

                if (
                    data.type ===
                    "start-listening"
                ) {
                    ws.send(
                        JSON.stringify({
                            type: "listening",
                        })
                    );
                }

                if (
                    data.type ===
                    "stop-listening"
                ) {
                    ws.send(
                        JSON.stringify({
                            type: "processing",
                        })
                    );

                    const filePath =
                        saveRecording();

                    if (!filePath) {
                        return;
                    }

                    console.time(
                        "Transcription"
                    );

                    const transcript =
                        await transcribeAudio(
                            filePath
                        );

                    if (
                        transcript &&
                        transcript.trim().split(" ").length < 2
                    ) {
                        ws.send(
                            JSON.stringify({
                                type: "assistant-response",
                                message:
                                    "I didn't catch that. Could you repeat it?",
                            })
                        );

                        return;
                    }

                    try {
                        fs.unlinkSync(
                            filePath
                        );

                        console.log(
                            "Deleted Recording:",
                            filePath
                        );
                    } catch (error) {
                        console.error(
                            "Delete Error:",
                            error
                        );
                    }

                    console.timeEnd(
                        "Transcription"
                    );

                    console.log(
                        "Transcript:",
                        transcript
                    );

                    ws.send(
                        JSON.stringify({
                            type: "transcript",
                            transcript,
                        })
                    );

                    if (!transcript) {
                        ws.send(
                            JSON.stringify({
                                type:
                                    "assistant-response",
                                message:
                                    "Speech could not be transcribed.",
                            })
                        );

                        return;
                    }

                    // ADD USER MESSAGE
                    conversationHistory.push({
                        role: "user",
                        content:
                            transcript,
                    });

                    console.time(
                        "LLM"
                    );

                    const aiResponse =
                        await generateResponse(
                            conversationHistory
                        );

                    console.timeEnd(
                        "LLM"
                    );

                    // ADD AI RESPONSE
                    conversationHistory.push({
                        role: "assistant",
                        content:
                            aiResponse,
                    });

                    console.log(
                        "History Length:",
                        conversationHistory.length
                    );

                    console.log(
                        "AI Response:",
                        aiResponse
                    );

                    ws.send(
                        JSON.stringify({
                            type:
                                "assistant-response",
                            message:
                                aiResponse,
                        })
                    );
                }

                // FUTURE NEW CHAT SUPPORT
                if (
                    data.type ===
                    "clear-history"
                ) {
                    conversationHistory.length = 1;

                    console.log(
                        "Conversation Reset"
                    );
                }
            }
        );

        ws.on("close", () => {
            console.log(
                "Client Disconnected"
            );
        });
    });
}

module.exports =
    initializeWebSocket;