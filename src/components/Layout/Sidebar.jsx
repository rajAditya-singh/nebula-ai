import { useState } from "react";

import SidebarItem from "./SidebarItem";
import UserProfile from "./UserProfile";

import {
  Menu,
  X,
  MessageSquarePlus,
  MessagesSquare,
  Settings,
  Mic,
  Sparkles,
} from "lucide-react";

function Sidebar({ onNewChat }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setIsOpen(true)}>
        <Menu size={24} />
      </button>

      <div
        className={`sidebar-overlay ${isOpen ? "show-overlay" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <button className="close-sidebar" onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>

        <h1 className="logo">Adiz AI</h1>

        <nav className="sidebar-menu">
          <div
            onClick={() => {
              onNewChat();
              setIsOpen(false);
            }}
          >
            <SidebarItem
              icon={<MessageSquarePlus size={20} />}
              text="New Chat"
              active
            />
          </div>

          <SidebarItem icon={<MessagesSquare size={20} />} text="Chats" />

          <SidebarItem icon={<Settings size={20} />} text="Settings" />

          <SidebarItem icon={<Mic size={20} />} text="Voice" />

          <SidebarItem icon={<Sparkles size={20} />} text="Theme" />
        </nav>

        <UserProfile />
      </aside>
    </>
  );
}

export default Sidebar;
