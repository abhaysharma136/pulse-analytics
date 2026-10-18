"use client";
import {
  BarChart3,
  X,
  LayoutDashboard,
  Users,
  ChevronDown,
  Sun,
  Moon,
  FileText,
  Settings,
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";
const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Analytics Explorer", icon: BarChart3 },
  { label: "Customers", icon: Users },
  { label: "Reports", icon: FileText },
  { label: "Settings", icon: Settings },
];

type sidebarProps = {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  activePage: string;
  setActivePage: (page: string) => void;
};
export function Sidebar({
  darkMode,
  setDarkMode,
  mobileMenuOpen,
  setMobileMenuOpen,
  activePage,
  setActivePage,
}: sidebarProps) {
  return (
    <div>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-[#111827] text-slate-300 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-18 items-center justify-between px-6">
          <div className="flex items-center gap-3 text-lg font-bold text-white">
            <div className="rounded-lg bg-indigo-500 p-2">
              <BarChart3 size={21} />
            </div>
            Pulse Analytics
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 hover:bg-slate-800 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Workspace
          </p>

          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                setActivePage(label);
                setMobileMenuOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                activePage === label
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {label}
            </button>
          ))}

          <div className="my-6 border-t border-slate-800" />

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Saved views
          </p>

          <button
            onClick={() => setActivePage("My Dashboards")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-slate-800 hover:text-white"
          >
            <LayoutDashboard size={19} />
            My Dashboards
          </button>

          <button
            onClick={() => setActivePage("Shared with me")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-slate-800 hover:text-white"
          >
            <Users size={19} />
            Shared with me
          </button>
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg border border-slate-700 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500 text-lg font-bold text-white">
              P
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">
                Personal Workspace
              </p>
              <p className="text-xs text-slate-400">Free Plan</p>
            </div>
            <ChevronDown size={16} />
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-slate-800 hover:text-white"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}
    </div>
  );
}
