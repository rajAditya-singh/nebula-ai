function ChatBubble({ text, type, time }) {
  return (
    <div className={`chat-bubble ${type}`}>
      <div className="message-text">{text}</div>

      <span className="message-time">{time}</span>
    </div>
  );
}

export default ChatBubble;
