import { Volume2 } from 'lucide-react';

interface SpeakButtonProps {
  active: boolean;
  onClick: () => void;
  size?: number;
  className?: string;
}

export function SpeakButton({ active, onClick, size = 13, className = '' }: SpeakButtonProps) {
  return (
    <button
      onClick={onClick}
      title="Dëgo shqiptimin"
      className={`rounded-full transition-colors ${
        active ? 'bg-blue-100 text-blue-600' : 'hover:text-blue-500 hover:bg-blue-50'
      } ${className}`}
    >
      <Volume2 size={size} />
    </button>
  );
}
