import SidebarItem from "./SidebarItem";
import UserProfile from "./UserProfile";

import {
  MessageSquarePlus,
  MessagesSquare,
  Settings,
  Mic,
  Sparkles,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h1 className="logo">AI Voice Assistant</h1>

      <nav className="sidebar-menu">
        <SidebarItem
          icon={<MessageSquarePlus size={20} />}
          text="New Chat"
          active
        />

        <SidebarItem icon={<MessagesSquare size={20} />} text="Chats" />

        <SidebarItem icon={<Settings size={20} />} text="Settings" />

        <SidebarItem icon={<Mic size={20} />} text="Voice" />

        <SidebarItem icon={<Sparkles size={20} />} text="Theme" />
      </nav>

      <UserProfile />
    </aside>
  );
}

export default Sidebar;
