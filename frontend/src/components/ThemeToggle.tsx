import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isCollapsed: boolean;
}

export function ThemeToggle({isCollapsed}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      className={` w-[80%]
        flex items-center gap-3 px-4 py-3 text-lg font-semibold rounded-lg
        transition-all duration-200
        hover:bg-gray-100 
        dark:hover:bg-[#2C2C3A] 
        active:scale-[0.98]
      `}
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <div className="flex items-center justify-center gap-4">
          <Sun className="w-5 h-5 text-yellow-400" />
          { !isCollapsed && <span className="text-gray-700 hover:text-[#c2bb6f] hidden sm:inline">Light Mode</span>}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-4 ">
          <Moon className="w-5 h-5 text-blue-600" />
          { !isCollapsed && <span className="hover:text-gray-900 text-blue-600 hidden sm:inline">Dark Mode</span>}
        </div>
      )}
    </Button>
  );
}
