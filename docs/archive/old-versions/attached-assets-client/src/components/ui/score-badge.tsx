import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ScoreBadge({ score, size = 'md', className }: ScoreBadgeProps) {
  const getScoreColor = () => {
    if (score >= 8) return 'bg-vegan-green';
    if (score >= 6) return 'bg-warning-orange';
    if (score >= 4) return 'bg-error-red';
    return 'bg-gray-400';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-xs';
      case 'lg':
        return 'w-16 h-16 text-lg';
      default:
        return 'w-12 h-12 text-sm';
    }
  };

  const getScoreLabel = () => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Limited';
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'score-badge text-white rounded-full flex items-center justify-center font-poppins font-semibold transition-transform hover:scale-110',
          getScoreColor(),
          getSizeClasses(),
          className
        )}
      >
        {score.toFixed(1)}
      </div>
      {size === 'lg' && (
        <span className="text-xs font-opensans text-neutral-gray mt-1">
          {getScoreLabel()}
        </span>
      )}
    </div>
  );
}
