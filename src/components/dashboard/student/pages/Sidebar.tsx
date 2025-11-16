"use client";

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  activeSidebarItem: string;
  setActiveSidebarItem: (item: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar = ({
  activeSidebarItem,
  setActiveSidebarItem,
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) => {
  const sidebarItems: SidebarItem[] = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "my-quizzes", label: "My Quizzes", icon: "📝" },
    { id: "passco", label: "Passco", icon: "📚" },
    { id: "practice", label: "Practice", icon: "💪" },
    { id: "e-learning", label: "E-Learning", icon: "🎓" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-opacity-50 lg:hidden z-20 transition-opacity"
        ></div>
      )}

      <aside
        className={`bg-white shadow-sm border-r border-gray-200 fixed top-0 left-0 h-full z-30 transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:w-64`}
      >
        <nav className="p-4 pt-24 lg:pt-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveSidebarItem(item.id);
                    setIsSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeSidebarItem === item.id
                      ? "bg-linear-to-r from-blue-50 to-violet-50 text-blue-600 border border-blue-100"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium hidden lg:inline">
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
