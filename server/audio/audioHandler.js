const fs = require("fs");
const path = require("path");

let audioChunks = [];

function handleAudioChunk(audioChunk) {
    audioChunks.push(audioChunk);

    console.log(
        "Audio Chunk Received:",
        audioChunk.length
    );
}

function saveRecording() {
    if (audioChunks.length === 0) {
        return null;
    }

    const filePath = path.join(
        __dirname,
        "recordings",
        `recording-${Date.now()}.webm`
    );

    const completeAudio =
        Buffer.concat(audioChunks);

    fs.writeFileSync(
        filePath,
        completeAudio
    );

    console.log(
        "Recording Saved:",
        filePath
    );

    audioChunks = [];

    return filePath;
}

module.exports = {
    handleAudioChunk,
    saveRecording,
};