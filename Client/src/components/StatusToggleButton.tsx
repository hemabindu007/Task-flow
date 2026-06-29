import type { ReactNode } from "react";
import ActionIconButton from "./ActionIconButton";

interface StatusToggleButtonProps {
  status: "active" | "inactive";
  entityName: string;
  entityType: "Employee" | "Project";
  activateIcon: ReactNode;
  inactivateIcon: ReactNode;
  onToggle: () => void;
  disabled?: boolean;
}

const StatusToggleButton = ({
  status,
  entityName,
  entityType,
  activateIcon,
  inactivateIcon,
  onToggle,
  disabled = false,
}: StatusToggleButtonProps) => {
  if (status === "active") {
    return (
      <ActionIconButton
        title={`Inactivate ${entityType}`}
        ariaLabel={`Inactivate ${entityType} ${entityName}`}
        icon={inactivateIcon}
        onClick={onToggle}
        disabled={disabled}
      />
    );
  }

  return (
    <ActionIconButton
      title={`Activate ${entityType}`}
      ariaLabel={`Activate ${entityType} ${entityName}`}
      icon={activateIcon}
      onClick={onToggle}
      disabled={disabled}
    />
  );
};

export default StatusToggleButton;
