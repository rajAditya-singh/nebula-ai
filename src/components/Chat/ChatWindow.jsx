import { useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";

function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  const [hideHero, setHideHero] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      setHideHero(true);
    } else {
      setHideHero(false);
    }
  }, [messages]);

  return (
    <>
      {messages.length === 0 && (
        <div
          className={`chat-window hero-screen ${hideHero ? "hero-hide" : ""}`}
        >
          <div className="hero-content">
            <p className="hero-subtitle">Personal AI Voice Assistant</p>

            <h1 className="hero-title">Meet Aditya Through AI</h1>

            <p className="hero-description">
              Ask me about AI, projects, debugging, mindset, growth, career
              journey, production incidents, and engineering.
            </p>

            <div className="hero-topics">
              <span>AI Integrations</span>
              <span>Production Issues</span>
              <span>Backend Engineering</span>
              <span>Career Growth</span>
            </div>
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="chat-window">
          <div className="today-label">Today</div>

          {messages.map((message, index) => (
            <ChatBubble
              key={index}
              type={message.role}
              text={message.text}
              time={message.time}
            />
          ))}

          <div ref={bottomRef}></div>
        </div>
      )}
    </>
  );
}

export default ChatWindow;
