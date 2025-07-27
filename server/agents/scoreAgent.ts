import { storage } from '../storage';
import { analyzeVeganFriendliness } from '../services/openai';
import { VeganScoreBreakdown } from '@shared/schema';

export class ScoreAgent {
  async calculateVeganScore(restaurantId: string): Promise<VeganScoreBreakdown> {
    try {
      const restaurant = await storage.getRestaurant(restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      // Get fresh data for analysis
      const analysisData = {
        name: restaurant.name,
        description: '', // Would be populated from Google Places or other sources
        cuisine: restaurant.cuisineTypes || [],
        menu: '', // Would be populated from menu scraping or manual input
        reviews: [] // Would be populated from review APIs
      };

      const veganAnalysis = await analyzeVeganFriendliness(analysisData);

      // Store the breakdown
      const breakdown = await storage.upsertVeganScoreBreakdown({
        restaurantId: restaurant.id,
        menuVariety: veganAnalysis.menuVariety.toString(),
        ingredientClarity: veganAnalysis.ingredientClarity.toString(),
        staffKnowledge: veganAnalysis.staffKnowledge.toString(),
        crossContaminationPrevention: veganAnalysis.crossContaminationPrevention.toString(),
        nutritionalInformation: veganAnalysis.nutritionalInformation.toString(),
        allergenManagement: veganAnalysis.allergenManagement.toString(),
        overallScore: veganAnalysis.overallScore.toString(),
      });

      // Update restaurant's overall vegan score
      await storage.updateRestaurant(restaurantId, {
        veganScore: veganAnalysis.overallScore.toString(),
      });

      return breakdown;
    } catch (error) {
      console.error('ScoreAgent: Error calculating vegan score:', error);
      throw new Error('Failed to calculate vegan score');
    }
  }

  async getScoreBreakdown(restaurantId: string): Promise<VeganScoreBreakdown | null> {
    try {
      const breakdown = await storage.getVeganScoreBreakdown(restaurantId);
      return breakdown || null;
    } catch (error) {
      console.error('ScoreAgent: Error getting score breakdown:', error);
      throw new Error('Failed to get score breakdown');
    }
  }

  async calculatePersonalMatch(
    restaurantId: string,
    userProfile: any
  ): Promise<{ tasteMatch: number; healthFit: number }> {
    try {
      const restaurant = await storage.getRestaurant(restaurantId);
      const scoreBreakdown = await storage.getVeganScoreBreakdown(restaurantId);
      
      if (!restaurant || !scoreBreakdown) {
        throw new Error('Restaurant or score data not found');
      }

      let tasteMatch = 0;
      let healthFit = 0;

      // Calculate taste match based on cuisine preferences
      if (userProfile.preferredCuisines && restaurant.cuisineTypes) {
        const matchingCuisines = restaurant.cuisineTypes.filter(cuisine =>
          userProfile.preferredCuisines.includes(cuisine.toLowerCase())
        );
        tasteMatch = Math.min(100, (matchingCuisines.length / userProfile.preferredCuisines.length) * 100);
      } else {
        tasteMatch = 70; // Default score if no preferences set
      }

      // Calculate health fit based on dietary style and allergen management
      const baseHealthScore = parseFloat(scoreBreakdown.overallScore) * 10; // Convert to percentage
      
      // Adjust based on dietary style compatibility
      if (userProfile.dietaryStyle === 'vegan') {
        healthFit = baseHealthScore;
      } else if (userProfile.dietaryStyle === 'vegetarian') {
        healthFit = Math.min(baseHealthScore, 85); // Cap for vegetarian
      } else {
        healthFit = Math.min(baseHealthScore, 75); // Cap for flexitarian
      }

      // Adjust for allergen concerns
      if (userProfile.allergies && userProfile.allergies.length > 0) {
        const allergenScore = parseFloat(scoreBreakdown.allergenManagement) * 10;
        healthFit = (healthFit + allergenScore) / 2; // Average with allergen management
      }

      return {
        tasteMatch: Math.round(tasteMatch),
        healthFit: Math.round(healthFit)
      };
    } catch (error) {
      console.error('ScoreAgent: Error calculating personal match:', error);
      throw new Error('Failed to calculate personal match');
    }
  }

  async updateScoreWithUserFeedback(
    restaurantId: string,
    userFeedback: {
      visitRating: number; // 1-5
      veganOptions: 'excellent' | 'good' | 'fair' | 'poor';
      staffKnowledge: 'excellent' | 'good' | 'fair' | 'poor';
      crossContamination: 'well-handled' | 'adequately-handled' | 'poorly-handled';
    }
  ): Promise<VeganScoreBreakdown> {
    try {
      const currentBreakdown = await storage.getVeganScoreBreakdown(restaurantId);
      if (!currentBreakdown) {
        throw new Error('No existing score breakdown found');
      }

      // Convert feedback to numeric adjustments
      const feedbackScores = {
        excellent: 0.2,
        good: 0.1,
        fair: 0,
        poor: -0.2,
        'well-handled': 0.2,
        'adequately-handled': 0.1,
        'poorly-handled': -0.2
      };

      // Apply weighted updates based on user feedback
      const updates = {
        menuVariety: Math.max(0, Math.min(10, 
          parseFloat(currentBreakdown.menuVariety) + 
          (feedbackScores[userFeedback.veganOptions] || 0)
        )),
        staffKnowledge: Math.max(0, Math.min(10,
          parseFloat(currentBreakdown.staffKnowledge) + 
          (feedbackScores[userFeedback.staffKnowledge] || 0)
        )),
        crossContaminationPrevention: Math.max(0, Math.min(10,
          parseFloat(currentBreakdown.crossContaminationPrevention) + 
          (feedbackScores[userFeedback.crossContamination] || 0)
        ))
      };

      // Recalculate overall score
      const newOverallScore = (
        updates.menuVariety +
        parseFloat(currentBreakdown.ingredientClarity) +
        updates.staffKnowledge +
        updates.crossContaminationPrevention +
        parseFloat(currentBreakdown.nutritionalInformation) +
        parseFloat(currentBreakdown.allergenManagement)
      ) / 6;

      // Update the breakdown
      const updatedBreakdown = await storage.upsertVeganScoreBreakdown({
        restaurantId,
        menuVariety: updates.menuVariety.toString(),
        ingredientClarity: currentBreakdown.ingredientClarity,
        staffKnowledge: updates.staffKnowledge.toString(),
        crossContaminationPrevention: updates.crossContaminationPrevention.toString(),
        nutritionalInformation: currentBreakdown.nutritionalInformation,
        allergenManagement: currentBreakdown.allergenManagement,
        overallScore: newOverallScore.toString(),
      });

      // Update restaurant's overall score
      await storage.updateRestaurant(restaurantId, {
        veganScore: newOverallScore.toString(),
      });

      return updatedBreakdown;
    } catch (error) {
      console.error('ScoreAgent: Error updating score with feedback:', error);
      throw new Error('Failed to update score with user feedback');
    }
  }

  async getScoreExplanation(restaurantId: string): Promise<string> {
    try {
      const breakdown = await storage.getVeganScoreBreakdown(restaurantId);
      if (!breakdown) {
        return 'No score breakdown available for this restaurant.';
      }

      const scores = {
        menuVariety: parseFloat(breakdown.menuVariety),
        ingredientClarity: parseFloat(breakdown.ingredientClarity),
        staffKnowledge: parseFloat(breakdown.staffKnowledge),
        crossContaminationPrevention: parseFloat(breakdown.crossContaminationPrevention),
        nutritionalInformation: parseFloat(breakdown.nutritionalInformation),
        allergenManagement: parseFloat(breakdown.allergenManagement),
        overall: parseFloat(breakdown.overallScore)
      };

      let explanation = `This restaurant has an overall vegan score of ${scores.overall.toFixed(1)}/10. `;

      // Highlight strengths
      const strengths = Object.entries(scores)
        .filter(([key, value]) => key !== 'overall' && value >= 8)
        .map(([key, value]) => ({ key: this.formatScoreCategory(key), value }));

      if (strengths.length > 0) {
        explanation += `Strengths include: ${strengths.map(s => `${s.key} (${s.value.toFixed(1)}/10)`).join(', ')}. `;
      }

      // Highlight areas for improvement
      const improvements = Object.entries(scores)
        .filter(([key, value]) => key !== 'overall' && value < 6)
        .map(([key, value]) => ({ key: this.formatScoreCategory(key), value }));

      if (improvements.length > 0) {
        explanation += `Areas for improvement: ${improvements.map(i => `${i.key} (${i.value.toFixed(1)}/10)`).join(', ')}.`;
      }

      return explanation;
    } catch (error) {
      console.error('ScoreAgent: Error getting score explanation:', error);
      return 'Unable to provide score explanation at this time.';
    }
  }

  private formatScoreCategory(category: string): string {
    const formatted = {
      menuVariety: 'Menu Variety',
      ingredientClarity: 'Ingredient Clarity',
      staffKnowledge: 'Staff Knowledge',
      crossContaminationPrevention: 'Cross-contamination Prevention',
      nutritionalInformation: 'Nutritional Information',
      allergenManagement: 'Allergen Management'
    };
    return formatted[category as keyof typeof formatted] || category;
  }
}

export const scoreAgent = new ScoreAgent();
