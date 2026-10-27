import React, { useState, useEffect } from "react";
import {
  Menu,
  Search,
  PlusCircle,
  ChevronRight,
  LayoutDashboard,
  Users,
  UserCheck,
  FileBarChart2,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [autoPrintTrigger, setAutoPrintTrigger] = useState(false);

  // Sidebar Collapsed state (stored in localStorage)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem("hr_sidebar_collapsed") === "true";
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("hr_sidebar_collapsed", String(next));
      return next;
    });
  };

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

  const handleOpenReport = (empId, shouldPrint = false) => {
    setSelectedEmployeeId(empId);
    setAutoPrintTrigger(shouldPrint);
    setActiveView("reports");
  };

  const handleDataSaved = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const viewMetadata = {
    overview: {
      title: "Overall Dashboard",
      icon: LayoutDashboard,
      badge: "Enterprise Analytics",
      description: "Aggregated metrics, demographics, department stats and satisfaction trends",
    },
    directory: {
      title: "Employee Directory",
      icon: Users,
      badge: "Roster Management",
      description: "Staff listing, multi-field search, department filters and individual shortcuts",
    },
    profile: {
      title: "Individual Profile",
      icon: UserCheck,
      badge: `ID: ${selectedEmployeeId}`,
      description: `Historical records, date-stamped reviews and performance telemetry for ${selectedEmployeeId}`,
    },
    reports: {
      title: "Reports & Exports",
      icon: FileBarChart2,
      badge: "Export Center",
      description: "Executive summaries, high-resolution printable memos and data export",
    },
  };

  const currentMeta = viewMetadata[activeView] || viewMetadata.overview;
  const CurrentIcon = currentMeta.icon;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 antialiased selection:bg-blue-600 selection:text-white print:min-h-0 print:bg-white print:text-black ${
        isDark
          ? "dark bg-mesh-dark text-slate-100"
          : "bg-mesh-light text-slate-900"
      }`}
    >
      {/* ── Modern Collapsible Sidebar ── */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isDark={isDark}
        toggleTheme={toggleTheme}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={toggleSidebarCollapse}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        onOpenDataEntry={handleOpenDataEntry}
        selectedEmployeeId={selectedEmployeeId}
      />

      {/* ── Main Layout Wrapper (Responsive to Sidebar Width) ── */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out print:pl-0 ${
          isSidebarCollapsed ? "lg:pl-[68px]" : "lg:pl-[250px]"
        }`}
      >
        {/* ── Top Header Navigation Bar ── */}
        <header
          className={`sticky top-0 z-30 border-b backdrop-blur-2xl transition-all duration-300 print:hidden ${
            isDark
              ? "border-slate-800/80 bg-slate-950/80 shadow-lg shadow-black/40"
              : "border-slate-200/80 bg-white/85 shadow-xs shadow-slate-900/5"
          }`}
        >
          <div className="w-full px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
            {/* Left Side: Mobile Menu Button & Breadcrumbs */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className={`lg:hidden flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border transition-colors cursor-pointer ${
                  isDark
                    ? "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
                aria-label="Open sidebar menu"
              >
                <Menu className="w-4 h-4" />
              </button>

              {/* Desktop Quick Toggle Icon */}
              <button
                onClick={toggleSidebarCollapse}
                className={`hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                  isDark
                    ? "border-slate-800/80 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
                    : "border-slate-200/80 bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
                title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-label="Toggle sidebar collapse"
              >
                {isSidebarCollapsed ? (
                  <PanelLeft className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>

              {/* Breadcrumb Info */}
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="hidden sm:inline text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0">
                  HR Pulse
                </span>
                <ChevronRight className="hidden sm:inline w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 truncate">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                      isDark
                        ? "bg-blue-500/15 text-cyan-400"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    <CurrentIcon className="w-3.5 h-3.5" />
                  </div>
                  <h1 className="text-xs sm:text-sm font-bold tracking-tight truncate text-slate-900 dark:text-white">
                    {currentMeta.title}
                  </h1>
                </div>
                <span className="hidden md:inline text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 shrink-0">
                  {currentMeta.badge}
                </span>
              </div>
            </div>

            {/* Right Side: Quick Search, DB Live Status, Theme Toggle & Quick CTA */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Quick Search Shortcut Pill */}
              <button
                onClick={() => setActiveView("directory")}
                title="Search directory (Ctrl+K / ⌘K)"
                className="hidden md:flex items-center gap-2 rounded-xl px-2.5 py-1.5 border text-xs font-medium text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70 hover:border-blue-400/40 transition-all cursor-pointer group"
              >
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-[11px] hidden lg:inline">Quick search</span>
                <kbd className="text-[9px] font-mono uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-400 font-semibold shadow-xs">
                  ⌘K
                </kbd>
              </button>

              {/* MySQL Live Indicator */}
              <div
                className={`hidden xl:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold ${
                  isDark
                    ? "border-slate-800/90 bg-slate-900/60 text-slate-300"
                    : "border-slate-200/90 bg-slate-50 text-slate-600"
                }`}
                title="MySQL Database Connected & Synchronized"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Sync</span>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={() => handleOpenDataEntry("review")}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:from-blue-700 hover:to-cyan-700 active:scale-95 transition-all cursor-pointer ring-1 ring-white/20"
                title="Add or update employee performance record"
              >
                <PlusCircle className="w-3.5 h-3.5 text-blue-100" />
                <span className="hidden sm:inline">Quick Entry</span>
                <span className="sm:hidden">Entry</span>
              </button>
            </div>
          </div>
        </header>

        {/* ── Main Application Content (min-w-0 for Responsive Charts) ── */}
        <main
          className="flex-1 min-w-0 w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-7 print:p-0 print:m-0 overflow-x-hidden"
          key={refreshKey}
        >
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
              onOpenReport={handleOpenReport}
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
            <ReportsView
              isDark={isDark}
              initialEmployeeId={selectedEmployeeId}
              autoPrint={autoPrintTrigger}
            />
          )}
        </main>
      </div>

      {/* ── Routine Data Entry Modal ── */}
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
