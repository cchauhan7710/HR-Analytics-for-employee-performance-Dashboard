import React from "react";
import { useAuth } from "../../Auth/Hook/useAuth";

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
  const { user, handleLogout } = useAuth();

  const roleLabel = { admin: "Administrator", hr_manager: "HR Manager", viewer: "Viewer" };
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "HR";

  const navigationItems = [
    { id: "overview", label: "Overall Dashboard" },
    { id: "directory", label: "Employee Directory" },
    { id: "profile", label: "Individual Profile" },
    { id: "reports", label: "Reports & Exports" },
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between select-none transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu">
      {/* ── TOP SECTION: Brand Header & Main Nav ── */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto overflow-x-hidden py-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300/60 dark:scrollbar-thumb-slate-700/70">
        {/* Brand Header */}
        {isCollapsed ? (
          <div className="h-14 flex items-center justify-center px-2 mb-2 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
            <button
              onClick={() => setIsCollapsed(false)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#0d2d5f] via-[#1d5da8] to-[#5ed0d4] shadow-[0_12px_28px_rgba(13,45,95,0.28)] ring-1 ring-white/15 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] active:scale-95 cursor-pointer transform-gpu"
              title="Expand navigation sidebar"
            >
              <img src="/image.png" alt="HR Pulse" className="h-8 w-8 object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)]" />
            </button>
          </div>
        ) : (
          <div className={`flex items-center justify-between px-3 py-3 mb-2 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            <div
              onClick={() => handleNavClick("overview")}
              className="flex items-center gap-2.5 cursor-pointer min-w-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              title="HR Pulse Analytics"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#0d2d5f] via-[#1d5da8] to-[#5ed0d4] shadow-[0_14px_30px_rgba(13,45,95,0.22)] ring-1 ring-white/15">
                <img src="/image.png" alt="HR Pulse Logo" className="h-7 w-7 object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.25)]" />
              </div>

              <div className="min-w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-100 translate-x-0">
                <div className="text-sm font-bold tracking-tight whitespace-nowrap">HR Pulse</div>
                <div className="mt-0.5 text-[9px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  MySQL v2.4
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-100 translate-x-0">
              <button
                onClick={() => setMobileOpen(false)}
                className="lg:hidden h-8 px-2 rounded-lg text-slate-400 hover:bg-slate-800/70 hover:text-white transition-colors"
                aria-label="Close sidebar"
              >
                Close
              </button>

              <button
                onClick={() => setIsCollapsed(true)}
                className={`hidden lg:flex h-8 px-2 items-center justify-center rounded-lg border transition-all duration-300 ease-out cursor-pointer ${
                  isDark
                    ? "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white"
                    : "border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                Hide
              </button>
            </div>
          </div>
        )}

        {/* Quick Action CTA (+ Quick Data Entry) */}
        {isCollapsed ? (
          <div className="flex justify-center px-2 py-1 overflow-hidden transition-[width,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
            <button
              onClick={() => onOpenDataEntry("review")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#0d2d5f] via-[#1b5a92] to-[#8cb6e0] text-white shadow-md shadow-[#0d2d5f]/25 ring-1 ring-white/20 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] active:scale-95 cursor-pointer transform-gpu"
              title="Quick Data Entry"
            >
              +
            </button>
          </div>
        ) : (
          <div className="px-3 py-1 overflow-hidden transition-[width,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-100 translate-x-0">
            <button
              onClick={() => onOpenDataEntry("review")}
              className="w-full flex items-center justify-center h-11 px-3.5 rounded-xl bg-gradient-to-r from-[#0d2d5f] via-[#1b5a92] to-[#8cb6e0] text-white text-xs font-bold shadow-md shadow-[#0d2d5f]/20 ring-1 ring-white/15 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:brightness-105 cursor-pointer transform-gpu"
              title="Add or update employee performance record"
            >
              <span className="truncate transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">Quick Data Entry</span>
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex w-full flex-col gap-1.5 px-3">
          {!isCollapsed && (
            <div className="px-1 pb-1 pt-2 text-[10px] font-bold tracking-[0.14em] uppercase text-slate-400 dark:text-slate-500 transition-[opacity,transform,max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden opacity-100 translate-x-0">
              Platform Views
            </div>
          )}

          <nav className="flex w-full flex-col gap-2" aria-label="Main Navigation">
            {navigationItems.map((item) => {
              const isActive = activeView === item.id;

              if (isCollapsed) {
                return (
                  <div key={item.id} className="flex justify-center py-0.5 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                    <button
                      onClick={() => handleNavClick(item.id)}
                      title={item.label}
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[9px] font-semibold tracking-wide transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer transform-gpu ${
                        isActive
                          ? "bg-gradient-to-r from-[#0d2d5f] to-[#7da0ca] text-white shadow-md shadow-[#0d2d5f]/20"
                          : isDark
                          ? "text-slate-400 hover:text-white hover:bg-slate-800/70"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
                      }`}
                    >
                      {item.label.slice(0, 2).toUpperCase()}
                    </button>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`group relative flex w-full items-center rounded-xl px-4 py-3.5 text-left transition-[background-color,color,transform,box-shadow] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer transform-gpu ${
                    isActive
                      ? isDark
                        ? "bg-[#1b5a92]/15 text-white ring-1 ring-[#7da0ca]/25 shadow-sm"
                        : "bg-[#0d2d5f] text-white shadow-sm"
                      : isDark
                      ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="text-[12px] sm:text-[13px] font-semibold leading-tight truncate">
                      {item.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
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
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-[9px] font-semibold transition-all cursor-pointer ${
                isDark
                  ? "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-800"
                  : "border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-200"
              }`}
            >
              {isDark ? "DM" : "LM"}
            </button>
          </div>
        ) : (
          <button
            onClick={toggleTheme}
            title={`Theme: ${isDark ? "Dark Obsidian" : "Light Quartz"}. Click to toggle.`}
            className={`flex items-center justify-center p-2.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
              isDark
                ? "border-slate-800 bg-slate-900/80 hover:border-slate-700 text-slate-300"
                : "border-slate-200 bg-slate-100/90 hover:border-slate-300 text-slate-700"
            }`}
          >
            {isDark ? "Dark Mode" : "Light Mode"}
          </button>
        )}

        {/* User Profile + Logout */}
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border cursor-pointer ${
                isDark ? "border-slate-800 bg-slate-900/70" : "border-slate-200 bg-white"
              }`}
              title={`${user?.name || "HR User"} • ${roleLabel[user?.role] || "Admin"}`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#0d2d5f] to-[#8cb6e0] text-white font-extrabold text-[10px] shadow-xs">
                {initials}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className={`flex h-8 px-2 items-center justify-center rounded-xl border text-[9px] font-semibold transition-colors cursor-pointer ${
                isDark
                  ? "border-slate-800 bg-slate-900/70 text-rose-400 hover:bg-rose-950/40 hover:border-rose-800"
                  : "border-slate-200 bg-white text-rose-500 hover:bg-rose-50 hover:border-rose-300"
              }`}
            >
              Out
            </button>
          </div>
        ) : (
          <div className={`rounded-xl border p-2.5 transition-all ${isDark ? "border-slate-800/90 bg-slate-900/70" : "border-slate-200/90 bg-white"}`}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0d2d5f] to-[#8cb6e0] text-white font-extrabold text-[11px] shadow-sm">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold leading-tight truncate text-slate-900 dark:text-slate-100">
                  {user?.name || "HR User"}
                </div>
                <div className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || ""}
                </div>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-end">
              <button
                onClick={handleLogout}
                title="Sign out of HR Pulse"
                className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                  isDark
                    ? "border-slate-700/80 text-rose-400 hover:bg-rose-950/40 hover:border-rose-800 bg-slate-800/60"
                    : "border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-300 bg-slate-50"
                }`}
              >
                Sign out
              </button>
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
        className={`hidden lg:flex flex-col fixed top-0 bottom-0 left-0 z-40 border-r backdrop-blur-2xl overflow-hidden transition-[width,box-shadow,transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width] transform-gpu print:hidden ${
          isCollapsed ? "w-[68px]" : "w-[272px]"
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
