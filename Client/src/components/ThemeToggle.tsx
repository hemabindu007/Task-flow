import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  const isLight = theme === "light";
  const label = `Switch to ${isLight ? "dark" : "light"} mode`;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white/80 text-gray-600 transition hover:border-gray-300 hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700 ${className}`}
    >
      {isLight ? (
        <MdDarkMode className="h-5 w-5" aria-hidden="true" />
      ) : (
        <MdLightMode className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggle;
