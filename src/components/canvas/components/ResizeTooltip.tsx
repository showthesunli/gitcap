interface ResizeTooltipProps {
  text: string;
}

export function ResizeTooltip({ text }: ResizeTooltipProps) {
  if (!text) return null;
  
  return (
    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
      {text}
    </div>
  );
}
