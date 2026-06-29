import type { ReactNode } from "react";

interface ActionIconButtonProps {
  title: string;
  ariaLabel: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const ActionIconButton = ({
  title,
  ariaLabel,
  icon,
  onClick,
  disabled = false,
  className = "",
}: ActionIconButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 ${className}`}
    >
      {icon}
    </button>
  );
};

export default ActionIconButton;
