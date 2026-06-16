const fs = require("fs");
const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey:
        process.env.GROQ_API_KEY,
});

async function transcribeAudio(
    filePath
) {
    try {
        if (
            !fs.existsSync(
                filePath
            )
        ) {
            throw new Error(
                "Audio file not found"
            );
        }

        const stats =
            fs.statSync(
                filePath
            );

        console.log(
            "Audio File Size:",
            stats.size
        );

        if (
            stats.size === 0
        ) {
            throw new Error(
                "Audio file is empty"
            );
        }

        const transcription =
            await groq.audio.transcriptions.create(
                {
                    file:
                        fs.createReadStream(
                            filePath
                        ),
                    model:
                        "whisper-large-v3",
                    language: "en",
                    response_format:
                        "verbose_json",
                }
            );

        console.log(
            "Transcript:",
            transcription.text
        );

        return (
            transcription.text
        );
    } catch (error) {
        console.error(
            "STT Error:",
            error
        );

        return null;
    }
}

module.exports = {
    transcribeAudio,
};