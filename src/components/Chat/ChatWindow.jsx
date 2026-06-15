import ChatBubble from "./ChatBubble";

function ChatWindow() {
  return (
    <div className="chat-window">
      <div className="today-label">Today</div>
      <ChatBubble
        type="assistant"
        text="Hello Raj! I'm doing great. How can I help you today?"
        time="10:30 AM"
      />

      <ChatBubble
        type="user"
        text="Explain React hooks in simple words."
        time="10:31 AM"
      />

      <ChatBubble
        type="assistant"
        text="React hooks are functions that let you hook into React state and lifecycle features from function components."
        time="10:31 AM"
      />
    </div>
  );
}

export default ChatWindow;
