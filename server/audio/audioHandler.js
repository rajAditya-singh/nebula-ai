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

    const recordingsDir = path.join(
        __dirname,
        "recordings"
    );

    if (!fs.existsSync(recordingsDir)) {
        fs.mkdirSync(recordingsDir, {
            recursive: true,
        });
    }

    const filePath = path.join(
        recordingsDir,
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