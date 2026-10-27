import React from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileBarChart2,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Search,
  X,
} from "lucide-react";

export default function Sidebar({
  activeView,
  setActiveView,
  isDark,
  toggleTheme,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  onOpenDataEntry,
  selectedEmployeeId,
}) {
  const navigationItems = [
    {
      id: "overview",
      label: "Overall Dashboard",
      icon: LayoutDashboard,
      badge: "Live",
      desc: "Org-wide metrics & charts",
    },
    {
      id: "directory",
      label: "Employee Directory",
      icon: Users,
      badge: "⌘K",
      desc: "Directory & staff roster",
    },
    {
      id: "profile",
      label: "Individual Profile",
      icon: UserCheck,
      badge: selectedEmployeeId ? selectedEmployeeId : null,
      desc: "360° employee performance",
    },
    {
      id: "reports",
      label: "Reports & Exports",
      icon: FileBarChart2,
      desc: "Printable executive memos",
    },
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between select-none">
      {/* ── TOP SECTION: Brand Header & Main Nav ── */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto overflow-x-hidden py-3">
        {/* Brand Header */}
        {isCollapsed ? (
          /* Collapsed Icon-Rail Header: Perfectly Centered Brand Logo Button */
          <div className="h-14 flex items-center justify-center border-b px-2 mb-1 border-slate-200/80 dark:border-slate-800/80">
            <button
              onClick={() => setIsCollapsed(false)}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md shadow-blue-500/10 p-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              title="Expand navigation sidebar"
            >
              <img
                src="/image.png"
                alt="HR Pulse"
                className="h-full w-full object-contain transition-transform group-hover:scale-110"
              />
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-400 animate-pulse" />
            </button>
          </div>
        ) : (
          /* Expanded Full Header: Brand + Status + Collapse Toggle Button */
          <div
            className={`h-14 flex items-center justify-between px-3.5 border-b mb-1 transition-colors ${
              isDark ? "border-slate-800/80" : "border-slate-200/80"
            }`}
          >
            <div
              onClick={() => handleNavClick("overview")}
              className="flex items-center gap-2.5 cursor-pointer group min-w-0"
              title="HR Pulse Analytics"
            >
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs p-1 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/image.png"
                  alt="HR Pulse Logo"
                  className="h-full w-full object-contain"
                />
                <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-slate-950 bg-emerald-400 animate-pulse" />
              </div>

              <div className="flex flex-col truncate">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-sm font-extrabold tracking-tight truncate ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    HR Pulse
                  </span>
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-xs">
                    PRO
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 truncate">
                    MySQL Live
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    • v2.4
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Collapse & Mobile Close */}
            <div className="flex items-center shrink-0">
              <button
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsCollapsed(true)}
                className={`hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                  isDark
                    ? "border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800"
                    : "border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
                title="Collapse sidebar to icon-rail"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Quick Action CTA (+ Quick Data Entry) */}
        {isCollapsed ? (
          <div className="flex justify-center px-2 py-1">
            <button
              onClick={() => onOpenDataEntry("review")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              title="Quick Data Entry"
            >
              <PlusCircle className="w-5 h-5 text-blue-100 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        ) : (
          <div className="px-3 py-1">
            <button
              onClick={() => onOpenDataEntry("review")}
              className="w-full group flex items-center justify-center gap-2 h-10 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white text-xs font-bold shadow-md shadow-blue-600/25 ring-1 ring-white/20 transition-all hover:shadow-blue-600/40 hover:scale-[1.01] active:scale-98 cursor-pointer"
              title="Add or update employee performance record"
            >
              <PlusCircle className="w-4 h-4 text-blue-100 group-hover:rotate-90 transition-transform duration-300" />
              <span>Quick Data Entry</span>
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-col gap-1 px-2">
          {!isCollapsed && (
            <div className="px-2.5 pb-1 pt-2 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
              Platform Views
            </div>
          )}

          <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              if (isCollapsed) {
                return (
                  <div key={item.id} className="flex justify-center py-0.5 relative">
                    <button
                      onClick={() => handleNavClick(item.id)}
                      title={`${item.label} – ${item.desc}`}
                      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-white/25"
                          : isDark
                          ? "text-slate-400 hover:text-white hover:bg-slate-800/80"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {/* Active indicator bar on the left edge */}
                      {isActive && (
                        <div className="absolute -left-2 top-2 bottom-2 w-1 rounded-r-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                      )}
                    </button>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`group relative flex items-center px-3 py-2.5 gap-3 rounded-xl transition-all duration-200 cursor-pointer text-left ${
                    isActive
                      ? isDark
                        ? "bg-gradient-to-r from-blue-600/90 via-blue-700/85 to-cyan-600/90 text-white font-bold shadow-md shadow-blue-900/30 ring-1 ring-white/20"
                        : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-md shadow-blue-600/20 ring-1 ring-white/25"
                      : isDark
                      ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-300 shadow-sm shadow-cyan-300" />
                  )}

                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive
                        ? "text-white"
                        : isDark
                        ? "text-slate-400 group-hover:text-cyan-400"
                        : "text-slate-500 group-hover:text-blue-600"
                    }`}
                  />

                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div className="truncate">
                      <div className="text-xs font-semibold leading-tight truncate">
                        {item.label}
                      </div>
                      <div
                        className={`text-[10px] font-normal leading-tight mt-0.5 truncate ${
                          isActive
                            ? "text-blue-100"
                            : isDark
                            ? "text-slate-500 group-hover:text-slate-400"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      >
                        {item.desc}
                      </div>
                    </div>

                    {item.badge && (
                      <span
                        className={`ml-2 shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                          isActive
                            ? "bg-white/20 text-white"
                            : isDark
                            ? "bg-slate-800 text-slate-400 border border-slate-700/60"
                            : "bg-slate-200 text-slate-600 border border-slate-300/60"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Shortcuts Section */}
        <div className="flex flex-col gap-1 px-2 pt-1">
          {!isCollapsed && (
            <div className="px-2.5 pb-1 pt-2 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
              Shortcuts
            </div>
          )}

          {isCollapsed ? (
            <div className="flex justify-center py-0.5">
              <button
                onClick={() => handleNavClick("directory")}
                title="Quick Search Directory (Ctrl+K / ⌘K)"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all cursor-pointer ${
                  isDark
                    ? "border-slate-800/80 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-900"
                    : "border-slate-200/80 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:bg-white"
                }`}
              >
                <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick("directory")}
              title="Quick Search Directory (Ctrl+K / ⌘K)"
              className={`group flex items-center px-3 py-2 gap-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                isDark
                  ? "border-slate-800/80 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-900"
                  : "border-slate-200/80 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:bg-white"
              }`}
            >
              <Search className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <span className="flex-1 text-left font-medium text-[11px] text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 truncate">
                Search roster...
              </span>
              <kbd className="text-[9px] font-mono uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-400 font-semibold shadow-xs">
                ⌘K
              </kbd>
            </button>
          )}
        </div>
      </div>

      {/* ── BOTTOM SECTION: Theme Toggle & User Info ── */}
      <div
        className={`flex flex-col gap-2.5 p-2.5 border-t transition-colors ${
          isDark ? "border-slate-800/80" : "border-slate-200/80"
        }`}
      >
        {/* Theme Switcher */}
        {isCollapsed ? (
          <div className="flex justify-center">
            <button
              onClick={toggleTheme}
              title={`Switch to ${isDark ? "Light Quartz" : "Dark Obsidian"} mode`}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? "border-slate-800 bg-slate-900 text-cyan-400 hover:border-slate-700 hover:bg-slate-800"
                  : "border-slate-200 bg-slate-100 text-amber-500 hover:border-slate-300 hover:bg-slate-200"
              }`}
            >
              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div
            onClick={toggleTheme}
            title={`Theme: ${isDark ? "Dark Obsidian" : "Light Quartz"}. Click to toggle.`}
            className={`flex items-center justify-between p-1.5 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? "border-slate-800 bg-slate-900/80 hover:border-slate-700"
                : "border-slate-200 bg-slate-100/90 hover:border-slate-300"
            }`}
          >
            <span className="text-[11px] font-semibold pl-2 text-slate-400 dark:text-slate-400">
              {isDark ? "Dark Mode" : "Light Mode"}
            </span>

            <div className="flex items-center gap-1">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-lg transition-all ${
                  !isDark
                    ? "bg-white text-amber-500 shadow-xs ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </div>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-lg transition-all ${
                  isDark
                    ? "bg-slate-800 text-cyan-400 shadow-xs ring-1 ring-white/10"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        )}

        {/* User Profile */}
        {isCollapsed ? (
          <div className="flex justify-center">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border cursor-pointer ${
                isDark ? "border-slate-800 bg-slate-900/70" : "border-slate-200 bg-white"
              }`}
              title="HR Admin • Enterprise Access"
            >
              <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-extrabold text-[10px] shadow-xs">
                HR
                <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-slate-950 bg-emerald-400" />
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`flex items-center gap-2.5 rounded-xl border p-2 transition-all ${
              isDark
                ? "border-slate-800/90 bg-slate-900/70"
                : "border-slate-200/90 bg-white"
            }`}
          >
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-extrabold text-[11px] shadow-sm">
              HR
              <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-slate-950 bg-emerald-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold leading-tight truncate text-slate-900 dark:text-slate-100">
                HR Admin
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                Enterprise Access
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP FIXED SIDEBAR ── */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 bottom-0 left-0 z-40 border-r backdrop-blur-2xl transition-all duration-300 ease-in-out print:hidden ${
          isCollapsed ? "w-[68px]" : "w-[250px]"
        } ${
          isDark
            ? "border-slate-800/80 bg-slate-950/90 shadow-2xl shadow-black/40"
            : "border-slate-200/90 bg-white/95 shadow-lg shadow-slate-900/5"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* ── MOBILE OVERLAY BACKDROP & DRAWER ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden print:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Slide-in Drawer */}
          <div
            className={`fixed top-0 bottom-0 left-0 w-[270px] max-w-[85vw] z-50 border-r backdrop-blur-2xl shadow-2xl transition-transform duration-300 animate-in slide-in-from-left ${
              isDark
                ? "border-slate-800 bg-slate-950 text-slate-100 shadow-black/80"
                : "border-slate-200 bg-white text-slate-900 shadow-slate-900/20"
            }`}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
