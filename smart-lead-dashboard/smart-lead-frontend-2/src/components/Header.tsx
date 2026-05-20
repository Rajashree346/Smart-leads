import { useState, useEffect, useRef } from "react";
import { useAuth } from "./provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, 
  User, 
  ChevronDown, 
  Calendar
} from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper to extract initials from the user name
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const formattedDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : "";

  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand & Section Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 shadow-md">
              <span className="text-sm font-bold text-white tracking-tight">S</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200 hidden sm:block">SmartLead</span>
          </div>
          
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Leads
          </span>
        </div>

        {/* Right Side: User Profile / Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer group"
          >
            {/* Initials Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white text-xs font-semibold select-none shadow-inner border border-white dark:border-slate-800">
              {getInitials(user?.name)}
            </div>
            <ChevronDown className={`h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-150 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Signed in as
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate mt-1">
                  {user?.name || "Active User"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {user?.email}
                </p>
              </div>

              {/* Profile Details (Read-only view within dropdown) */}
              <div className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>ID: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">{user?._id}</code></span>
                </div>
                {formattedDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Member since {formattedDate}</span>
                  </div>
                )}
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800/60 my-1" />

              {/* Logout Button */}
              <div className="px-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}
