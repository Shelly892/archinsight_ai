import { SpinnerIcon } from "./SpinnerIcon";

export function LoadingIndicator({ text }: { text: string }) {
  return (
    <div className="text-gray-400 text-sm mt-2 animate-pulse flex items-center gap-2">
      <SpinnerIcon />
      {text}
    </div>
  );
}
