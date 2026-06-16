require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");

const initializeWebSocket =
    require("./websocket/socketServer");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Nebula Backend Running");
});

const server = http.createServer(app);

initializeWebSocket(server);

const PORT = 3001;

server.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});