function SidebarItem({ icon, text, active }) {
  return (
    <button className={`sidebar-item ${active ? "active" : ""}`}>
      <span className="sidebar-icon">{icon}</span>

      <span>{text}</span>
    </button>
  );
}

export default SidebarItem;
