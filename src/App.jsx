import { useState, useEffect } from "react";

import Sidebar from "./components/Layout/Sidebar";
import ChatWindow from "./components/Chat/ChatWindow";
import VoiceDock from "./components/Voice/VoiceDock";

import "./styles/globals.css";
import "./styles/layout.css";
import "./styles/sidebar.css";
import "./styles/chat.css";
import "./styles/voice.css";

function App() {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("nebula-chat");

    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  useEffect(() => {
    localStorage.setItem("nebula-chat", JSON.stringify(messages));
  }, [messages]);

  const handleNewChat = () => {
    setMessages([]);

    localStorage.removeItem("nebula-chat");

    window.dispatchEvent(new CustomEvent("clear-nebula-history"));
  };

  return (
    <div className="app-layout">
      <Sidebar onNewChat={handleNewChat} />

      <div className="main-area">
        <ChatWindow messages={messages} />

        <VoiceDock messages={messages} setMessages={setMessages} />
      </div>
    </div>
  );
}

export default App;
