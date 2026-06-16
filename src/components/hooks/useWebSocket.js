import {
    useEffect,
    useState,
} from "react";

function useWebSocket() {
    const [socket, setSocket] =
        useState(null);

    const [lastMessage, setLastMessage] =
        useState(null);

    useEffect(() => {
        const ws = new WebSocket(
            "ws://localhost:3001"
        );

        ws.onopen = () => {
            console.log(
                "Socket Connected"
            );
        };

        ws.onmessage = (
            event
        ) => {
            const data =
                JSON.parse(
                    event.data
                );

            console.log(
                "Socket Message:",
                data
            );

            setLastMessage(data);
        };

        ws.onclose = () => {
            console.log(
                "Socket Closed"
            );
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = (
        data
    ) => {
        if (
            socket &&
            socket.readyState ===
            WebSocket.OPEN
        ) {
            socket.send(
                JSON.stringify(data)
            );
        }
    };

    const sendAudioChunk =
        async (
            audioChunk
        ) => {
            if (
                !socket ||
                socket.readyState !==
                WebSocket.OPEN
            ) {
                return;
            }

            const arrayBuffer =
                await audioChunk.arrayBuffer();

            socket.send(
                arrayBuffer
            );
        };

    return {
        socket,
        lastMessage,
        sendMessage,
        sendAudioChunk,
    };
}

export default useWebSocket;