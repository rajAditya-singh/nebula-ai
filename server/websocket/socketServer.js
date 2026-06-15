const WebSocket = require("ws");
const { handleAudioChunk, saveRecording, } = require("../audio/audioHandler");

function initializeWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        console.log("Client Connected");

        ws.send(
            JSON.stringify({
                type: "connected",
                message: "Nebula Socket Connected",
            })
        );

        ws.on("message", (message) => {
            let data;

            try {
                data = JSON.parse(message);
            } catch {
                handleAudioChunk(message);

                return;
            }

            console.log("Received:", data);

            if (data.type === "start-listening") {
                ws.send(
                    JSON.stringify({
                        type: "listening",
                    })
                );

                setTimeout(() => {
                    ws.send(
                        JSON.stringify({
                            type: "processing",
                        })
                    );
                }, 2000);

                setTimeout(() => {
                    ws.send(
                        JSON.stringify({
                            type: "speaking",
                        })
                    );
                }, 4000);

                setTimeout(() => {
                    saveRecording();

                    ws.send(
                        JSON.stringify({
                            type: "idle",
                        })
                    );
                }, 6000);
            }
        });

        ws.on("close", () => {
            console.log("Client Disconnected");
        });
    });
}

module.exports = initializeWebSocket;