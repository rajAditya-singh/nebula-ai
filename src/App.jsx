import Sidebar from "./components/Layout/Sidebar";
import ChatWindow from "./components/Chat/ChatWindow";
import VoiceDock from "./components/Voice/VoiceDock";

import "./styles/globals.css";
import "./styles/layout.css";
import "./styles/sidebar.css";
import "./styles/chat.css";
import "./styles/voice.css";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <ChatWindow />
        <VoiceDock />
      </div>
    </div>
  );
}

export default App;
