import { useTheme } from "next-themes";
import { Button } from "./ui/button"; // Import the Button component from Shadcn UI
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="default"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <span className="text-xl font-normal text-gray-700 dark:text-gray-900">
      {theme === "dark" ? <Sun/> : <Moon/>}
      </span>
    </Button>
  );
}
