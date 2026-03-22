import { useState } from "react";

interface ResultCardProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T, idx: number) => React.ReactNode;
  emptyMessage?: string;
}

export function ResultCard<T>({
  title,
  items,
  renderItem,
  emptyMessage = "No results found.",
}: ResultCardProps<T>) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) {
    return (
      <div className="text-gray-500 text-sm mt-2 italic">{emptyMessage}</div>
    );
  }

  const visibleItems = isExpanded ? items : items.slice(0, 3);
  const hiddenCount = items.length - 3;

  return (
    <div className="mt-2 mb-3 p-3 bg-white border border-gray-200 rounded-md shadow-sm">
      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
        {title} ({items.length})
      </p>
      <div className="space-y-2">
        {visibleItems.map((item, idx) => renderItem(item, idx))}
      </div>
      {hiddenCount > 0 && (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          {isExpanded ? "Show less ↑" : `Show ${hiddenCount} more ↓`}
        </button>
      )}
    </div>
  );
}
