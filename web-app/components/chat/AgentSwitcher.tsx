import { AgentType } from "./types";

const AGENT_STYLES: Record<AgentType, { active: string; label: string }> = {
  project: { active: "bg-blue-100 text-blue-700", label: "@project" },
  search: { active: "bg-green-100 text-green-700", label: "@search" },
  case: { active: "bg-purple-100 text-purple-700", label: "@case" },
};

interface AgentSwitcherProps {
  availableAgents: AgentType[];
  currentAgent: AgentType;
  onChange: (agent: AgentType) => void;
}

export function AgentSwitcher({
  availableAgents,
  currentAgent,
  onChange,
}: AgentSwitcherProps) {
  return (
    <div className="flex gap-2 text-xs">
      {availableAgents.map((agent) => {
        const { active, label } = AGENT_STYLES[agent];
        const isActive = currentAgent === agent;
        return (
          <button
            key={agent}
            type="button"
            onClick={() => onChange(agent)}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
              isActive ? active : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
