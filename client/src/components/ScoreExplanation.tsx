import { useState } from 'react';
import { Info, Star } from 'lucide-react';
import { designTokens } from '../styles/designTokens';

interface ScoreExplanationProps {
  score: number;
  breakdown?: {
    menuVariety: number;
    ingredientClarity: number;
    staffKnowledge: number;
    crossContamination: number;
    nutritionalInfo: number;
    allergenManagement: number;
  };
  restaurantName: string;
}

export function ScoreExplanation({ score, breakdown, restaurantName }: ScoreExplanationProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getScoreText = (score: number) => {
    if (score >= 4.5) return "Excellent vegan options";
    if (score >= 3.5) return "Good vegan choices";
    if (score >= 2.5) return "Some vegan options";
    if (score >= 1.5) return "Limited vegan options";
    return "Few vegan options";
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2 cursor-pointer" 
           onClick={() => setShowDetails(!showDetails)}>
        <div className="flex items-center">
          <Star className={`w-4 h-4 ${getScoreColor(score)} fill-current`} />
          <span className={`ml-1 font-semibold ${getScoreColor(score)}`}>
            {score.toFixed(1)}
          </span>
        </div>
        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
      </div>

      {showDetails && (
        <div 
          className="absolute z-10 mt-2"
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            marginTop: '8px',
            width: designTokens.popupSizes.scoreExplanation.width,
            maxWidth: designTokens.popupSizes.scoreExplanation.maxWidth,
            padding: designTokens.popupSizes.scoreExplanation.padding,
            backgroundColor: designTokens.colors.background.primary,
            border: `1px solid ${designTokens.colors.border}`,
            borderRadius: designTokens.borderRadius.lg,
            boxShadow: designTokens.shadows.lg,
            zIndex: designTokens.zIndex.popover
          }}
        >
          <div style={{ marginBottom: designTokens.spacing.md }}>
            <h4 style={{
              ...designTokens.typography.h4,
              color: designTokens.colors.text.primary,
              marginBottom: designTokens.spacing.xs
            }}>
              Vegan Score: {getScoreText(score)}
            </h4>
            <p style={{
              ...designTokens.typography.bodySmall,
              color: designTokens.colors.text.secondary
            }}>
              AI analysis of {restaurantName}'s vegan-friendliness
            </p>
          </div>

          {breakdown ? (
            <div className="space-y-2">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Menu Variety:</span>
                  <span className="font-medium">{breakdown.menuVariety}/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Clear Labeling:</span>
                  <span className="font-medium">{breakdown.ingredientClarity}/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Staff Knowledge:</span>
                  <span className="font-medium">{breakdown.staffKnowledge}/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Safety Measures:</span>
                  <span className="font-medium">{breakdown.crossContamination}/5</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              <p>Score based on:</p>
              <ul className="mt-1 ml-4 list-disc">
                <li>Menu analysis for vegan options</li>
                <li>Ingredient transparency</li>
                <li>Kitchen safety practices</li>
                <li>Staff training on dietary needs</li>
              </ul>
            </div>
          )}

          <div className="mt-3 pt-3 border-t text-xs text-gray-500">
            Powered by AI • Updated regularly
          </div>
        </div>
      )}
    </div>
  );
}