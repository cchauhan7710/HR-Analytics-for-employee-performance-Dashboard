import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileBarChart2,
  PlusCircle,
  Sparkles,
  Database,
  Menu,
  X,
  Layers,
  Activity,
  ArrowUpRight,
  Sun,
  Moon,
  Search,
  Command,
  ShieldCheck,
} from "lucide-react";
import OverviewView from "../Views/OverviewView";
import EmployeeDirectoryView from "../Views/EmployeeDirectoryView";
import IndividualProfileView from "../Views/IndividualProfileView";
import ReportsView from "../Views/ReportsView";
import DataEntryModal from "../Components/DataEntryModal";

export default function Dashboard() {
  const [activeView, setActiveView] = useState("overview"); // "overview" | "directory" | "profile" | "reports"
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("EMP001");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("review");
  const [modalEmpId, setModalEmpId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Premium Theme Switcher: Defaults to "dark" (Obsidian Luxe) with option to switch to "light" (Quartz)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("hr_theme") || "dark";
  });

  const isDark = theme === "dark";

  useEffect(() => {
    localStorage.setItem("hr_theme", theme);
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [theme, isDark]);

  // Global keyboard shortcut: Ctrl+K / Cmd+K switches directly to Employee Directory
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setActiveView("directory");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleOpenDataEntry = (mode = "review", empId = "") => {
    setModalMode(mode);
    setModalEmpId(empId || selectedEmployeeId || "EMP001");
    setModalOpen(true);
  };

  const handleSelectEmployee = (empId) => {
    setSelectedEmployeeId(empId);
    setActiveView("profile");
  };

  const handleOpenReport = (empId) => {
    setSelectedEmployeeId(empId);
    setActiveView("reports");
  };

  const handleDataSaved = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const navigationTabs = [
    {
      id: "overview",
      label: "Overall Dashboard",
      icon: LayoutDashboard,
      desc: "Org-wide summaries & trends",
    },
    {
      id: "directory",
      label: "Employee Directory",
      icon: Users,
      desc: "Search & roster management",
    },
    {
      id: "profile",
      label: "Individual Profile",
      icon: UserCheck,
      desc: "Dated metrics & history",
    },
    {
      id: "reports",
      label: "Reports & Exports",
      icon: FileBarChart2,
      desc: "Printable executive memos",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 antialiased selection:bg-blue-600 selection:text-white ${
        isDark
          ? "dark bg-mesh-dark text-slate-100"
          : "bg-mesh-light text-slate-900"
      }`}
    >
      {/* ── Top Navigation & Brand Header (Unified Single-Tier Architecture) ── */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-2xl transition-all duration-300 ${
          isDark
            ? "border-slate-800/80 bg-slate-950/85 shadow-2xl shadow-black/50"
            : "border-slate-200/80 bg-white/85 shadow-xs shadow-slate-900/5"
        }`}
      >
        <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between px-3 sm:px-5 lg:px-6 h-18 gap-4">
          {/* Left Side: Brand Title & Navigation Tabs */}
          <div className="flex items-center gap-4 lg:gap-5 shrink-0">
            {/* Brand Title / Identity */}
            <button
              onClick={() => setActiveView("overview")}
              className="group flex items-center gap-3 cursor-pointer text-left focus:outline-none shrink-0"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-700 to-cyan-500 text-white shadow-lg shadow-blue-600/30 ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-105">
                <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400 animate-pulse" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className={`text-base font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                    HR Pulse
                  </span>
                  <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    PRO
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    MySQL Live
                  </span>
                  <span className="hidden xl:inline text-[10px] text-slate-400 dark:text-slate-500">
                    • Enterprise
                  </span>
                </div>
              </div>
            </button>

            {/* Vertical Divider */}
            <div className="hidden lg:block h-6 w-px bg-slate-200/90 dark:bg-slate-800/90" />

            {/* Left-Aligned Segmented Navigation Tabs */}
            <nav
              className={`hidden md:flex items-center p-1 rounded-2xl border shadow-inner gap-1 ${
                isDark
                  ? "bg-slate-900/90 border-slate-800/90"
                  : "bg-slate-100/90 border-slate-200/90"
              }`}
              aria-label="Main Navigation"
            >
              {navigationTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`group relative flex items-center gap-2 rounded-xl py-1.5 px-3 lg:px-3.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-white/20"
                        : isDark
                        ? "text-slate-400 hover:text-white hover:bg-slate-800/80"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/90"
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-white" : isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Side: Quick Search, Theme Switcher, Quick Entry, Avatar & Mobile Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3.5 shrink-0">
            {/* Quick Search Shortcut Pill */}
            <button
              onClick={() => setActiveView("directory")}
              title="Search directory (Ctrl+K / ⌘K)"
              className="hidden xl:flex items-center gap-2 rounded-xl px-3 py-1.5 border text-xs font-medium text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70 hover:border-blue-400/40 transition-all cursor-pointer group"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-[11px]">Quick search...</span>
              <kbd className="text-[9px] font-mono uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-400 font-semibold shadow-xs">
                ⌘K
              </kbd>
            </button>

            {/* Ergonomic Dual-State Theme Toggle Capsule */}
            <div
              onClick={toggleTheme}
              title={`Currently in ${isDark ? "Dark Obsidian" : "Light Quartz"} mode. Click to toggle.`}
              className={`flex items-center p-1 rounded-xl border transition-all cursor-pointer select-none ${
                isDark
                  ? "border-slate-800 bg-slate-900/90 hover:border-slate-700"
                  : "border-slate-200 bg-slate-100/90 hover:border-slate-300"
              }`}
            >
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

            {/* Subtle Divider between utilities & primary CTA */}
            <div className="hidden sm:block h-5 w-px bg-slate-200/90 dark:bg-slate-800/90" />

            {/* Quick Entry Action CTA */}
            <button
              onClick={() => handleOpenDataEntry("review")}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:from-blue-700 hover:to-cyan-700 active:scale-95 transition-all cursor-pointer ring-1 ring-white/20"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-100" />
              <span className="hidden xs:inline">Quick Entry</span>
              <span className="xs:hidden">Entry</span>
            </button>

            {/* Admin Avatar Chip */}
            <div
              className={`hidden sm:flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl border text-xs font-semibold ${
                isDark
                  ? "bg-slate-900/90 border-slate-800 text-slate-300"
                  : "bg-slate-50 border-slate-200/90 text-slate-700"
              }`}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-extrabold text-[10px] shadow-xs">
                HR
              </div>
              <span className="text-[11px] font-bold">Admin</span>
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                isDark
                  ? "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden border-t px-4 py-3 space-y-1.5 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200 shadow-2xl ${
              isDark ? "border-slate-800 bg-slate-950/95" : "border-slate-200 bg-white/95"
            }`}
          >
            {/* Quick Search on Mobile */}
            <button
              onClick={() => {
                setActiveView("directory");
                setMobileMenuOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-xl p-2.5 mb-2 text-xs border font-medium ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-slate-400"
                  : "bg-slate-50 border-slate-200 text-slate-500"
              }`}
            >
              <Search className="w-4 h-4 text-blue-500" />
              <span>Search employee directory...</span>
            </button>

            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveView(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl p-2.5 text-left text-xs font-bold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm"
                      : isDark
                      ? "text-slate-400 hover:bg-slate-900 hover:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <div>
                      <div>{tab.label}</div>
                      <div className="text-[10px] opacity-75 font-normal">{tab.desc}</div>
                    </div>
                  </div>
                  {isActive && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </button>
              );
            })}

            <div
              className={`pt-2.5 mt-2 border-t flex items-center justify-between text-[11px] px-2 ${
                isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                MySQL Database Live
              </span>
              <span className="font-mono text-blue-600 dark:text-cyan-400 font-semibold">
                ID: {selectedEmployeeId}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Application Content ─────────────────────────── */}
      <main className="mx-auto max-w-[1400px] px-3 sm:px-5 lg:px-6 py-6 sm:py-8" key={refreshKey}>
        {activeView === "overview" && (
          <OverviewView
            isDark={isDark}
            onOpenDataEntry={handleOpenDataEntry}
            onSelectEmployee={handleSelectEmployee}
          />
        )}

        {activeView === "directory" && (
          <EmployeeDirectoryView
            isDark={isDark}
            onSelectEmployee={handleSelectEmployee}
            onOpenDataEntry={handleOpenDataEntry}
          />
        )}

        {activeView === "profile" && (
          <IndividualProfileView
            isDark={isDark}
            selectedEmployeeId={selectedEmployeeId}
            onSelectEmployee={setSelectedEmployeeId}
            onOpenDataEntry={handleOpenDataEntry}
            onOpenReport={handleOpenReport}
          />
        )}

        {activeView === "reports" && (
          <ReportsView isDark={isDark} initialEmployeeId={selectedEmployeeId} />
        )}
      </main>

      {/* ── Routine Data Entry Modal ─────────────────────────── */}
      <DataEntryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialMode={modalMode}
        prefilledEmployeeId={modalEmpId}
        onSuccess={handleDataSaved}
        isDark={isDark}
      />
    </div>
  );
}
