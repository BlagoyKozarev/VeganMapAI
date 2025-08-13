import { storage } from '../storage';
import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ReviewAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  veganMentions: string[];
  allergenWarnings: string[];
  highlights: string[];
  concerns: string[];
  veganFriendlinessScore: number; // 0-10
}

export class ReviewAgent {
  async analyzeReviews(restaurantId: string, reviews: string[]): Promise<ReviewAnalysis> {
    try {
      if (!reviews || reviews.length === 0) {
        return {
          sentiment: 'neutral',
          veganMentions: [],
          allergenWarnings: [],
          highlights: [],
          concerns: [],
          veganFriendlinessScore: 5.0
        };
      }

      const prompt = `
        Analyze the following restaurant reviews for vegan-friendliness and allergen information.
        
        Reviews:
        ${reviews.slice(0, 20).join('\n---\n')}
        
        Please analyze and extract:
        1. Overall sentiment towards vegan options
        2. Specific mentions of vegan dishes or options
        3. Any allergen warnings or concerns mentioned
        4. Positive highlights about vegan experience
        5. Concerns or negative aspects about vegan options
        6. Overall vegan-friendliness score (0-10)
        
        Respond with JSON in this exact format:
        {
          "sentiment": "positive|negative|neutral",
          "veganMentions": ["array of specific vegan dishes/options mentioned"],
          "allergenWarnings": ["array of allergen concerns mentioned"],
          "highlights": ["array of positive vegan dining highlights"],
          "concerns": ["array of concerns about vegan options"],
          "veganFriendlinessScore": number
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert at analyzing restaurant reviews for vegan dining experiences and allergen information."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      return {
        sentiment: result.sentiment || 'neutral',
        veganMentions: result.veganMentions || [],
        allergenWarnings: result.allergenWarnings || [],
        highlights: result.highlights || [],
        concerns: result.concerns || [],
        veganFriendlinessScore: Math.max(0, Math.min(10, result.veganFriendlinessScore || 5))
      };
    } catch (error) {
      console.error('ReviewAgent: Error analyzing reviews:', error);
      throw new Error('Failed to analyze reviews');
    }
  }

  async extractVeganKeywords(text: string): Promise<string[]> {
    try {
      const veganKeywords = [
        'vegan', 'plant-based', 'dairy-free', 'egg-free', 'no meat', 'vegetarian',
        'tofu', 'tempeh', 'seitan', 'quinoa', 'chickpea', 'lentil',
        'almond milk', 'soy milk', 'oat milk', 'coconut milk',
        'beyond meat', 'impossible', 'veggie burger', 'plant protein',
        'nutritional yeast', 'cashew cheese', 'vegan cheese',
        'animal-free', 'cruelty-free', 'plant milk'
      ];

      const foundKeywords = veganKeywords.filter(keyword => 
        text.toLowerCase().includes(keyword.toLowerCase())
      );

      return [...new Set(foundKeywords)]; // Remove duplicates
    } catch (error) {
      console.error('ReviewAgent: Error extracting vegan keywords:', error);
      return [];
    }
  }

  async detectAllergens(text: string): Promise<string[]> {
    try {
      const allergenPatterns = {
        'nuts': /\b(nut|almond|walnut|pecan|cashew|pistachio|hazelnut|peanut)\b/gi,
        'dairy': /\b(milk|cheese|butter|cream|yogurt|lactose|dairy)\b/gi,
        'gluten': /\b(gluten|wheat|bread|pasta|flour|barley|rye)\b/gi,
        'soy': /\b(soy|soya|tofu|tempeh|miso|soy sauce)\b/gi,
        'shellfish': /\b(shrimp|lobster|crab|shellfish|seafood)\b/gi,
        'eggs': /\b(egg|eggs|mayonnaise|mayo)\b/gi,
        'sesame': /\b(sesame|tahini)\b/gi,
        'fish': /\b(fish|salmon|tuna|cod|anchovy)\b/gi
      };

      const detectedAllergens: string[] = [];

      for (const [allergen, pattern] of Object.entries(allergenPatterns)) {
        if (pattern.test(text)) {
          detectedAllergens.push(allergen);
        }
      }

      return detectedAllergens;
    } catch (error) {
      console.error('ReviewAgent: Error detecting allergens:', error);
      return [];
    }
  }

  async generateReviewSummary(restaurantId: string): Promise<string> {
    try {
      const restaurant = await storage.getRestaurant(restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      // This would typically fetch actual reviews from Google Places, Yelp, etc.
      // For now, we'll create a placeholder summary
      const scoreBreakdown = await storage.getVeganScoreBreakdown(restaurantId);
      
      if (!scoreBreakdown) {
        return `${restaurant.name} is still being analyzed for vegan-friendliness. Check back soon for detailed reviews!`;
      }

      const overallScore = parseFloat(scoreBreakdown.overallScore);
      
      let summary = `Based on customer reviews, ${restaurant.name} `;
      
      if (overallScore >= 8) {
        summary += 'is highly praised for its vegan options. ';
      } else if (overallScore >= 6) {
        summary += 'offers decent vegan choices with room for improvement. ';
      } else {
        summary += 'has limited vegan options but may accommodate special requests. ';
      }

      // Add specific insights based on score breakdown
      const menuScore = parseFloat(scoreBreakdown.menuVariety);
      const staffScore = parseFloat(scoreBreakdown.staffKnowledge);
      
      if (menuScore >= 8) {
        summary += 'Customers appreciate the variety of plant-based dishes available. ';
      }
      
      if (staffScore >= 8) {
        summary += 'The staff is knowledgeable about vegan options and dietary restrictions. ';
      } else if (staffScore < 6) {
        summary += 'Some reviewers noted that staff could be more informed about vegan ingredients. ';
      }

      return summary;
    } catch (error) {
      console.error('ReviewAgent: Error generating review summary:', error);
      return 'Unable to generate review summary at this time.';
    }
  }

  async flagPotentialIssues(reviews: string[]): Promise<{
    crossContaminationWarnings: string[];
    misleadingVeganClaims: string[];
    allergenConcerns: string[];
  }> {
    try {
      const prompt = `
        Analyze the following restaurant reviews for potential issues that vegan diners should be aware of:
        
        Reviews:
        ${reviews.slice(0, 15).join('\n---\n')}
        
        Look for:
        1. Cross-contamination warnings (shared grills, fryers, prep areas)
        2. Misleading vegan claims (items marked vegan that aren't)
        3. Allergen concerns mentioned by reviewers
        
        Respond with JSON:
        {
          "crossContaminationWarnings": ["specific warnings about cross-contamination"],
          "misleadingVeganClaims": ["instances where vegan labels were incorrect"],
          "allergenConcerns": ["allergen-related issues mentioned"]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a food safety expert focused on vegan dining and allergen management."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      return {
        crossContaminationWarnings: result.crossContaminationWarnings || [],
        misleadingVeganClaims: result.misleadingVeganClaims || [],
        allergenConcerns: result.allergenConcerns || []
      };
    } catch (error) {
      console.error('ReviewAgent: Error flagging potential issues:', error);
      return {
        crossContaminationWarnings: [],
        misleadingVeganClaims: [],
        allergenConcerns: []
      };
    }
  }

  async scoreReviewHelpfulness(
    reviewText: string,
    userProfile: any
  ): Promise<number> {
    try {
      let helpfulnessScore = 0;

      // Check for detailed vegan information
      const veganKeywords = await this.extractVeganKeywords(reviewText);
      helpfulnessScore += veganKeywords.length * 0.1;

      // Check for specific dish mentions
      const dishMentionCount = (reviewText.match(/\b(dish|meal|food|ordered|tried)\b/gi) || []).length;
      helpfulnessScore += Math.min(dishMentionCount * 0.05, 0.3);

      // Check for allergen information relevant to user
      if (userProfile.allergies) {
        const allergenMentions = await this.detectAllergens(reviewText);
        const relevantAllergens = allergenMentions.filter(allergen => 
          userProfile.allergies.includes(allergen)
        );
        helpfulnessScore += relevantAllergens.length * 0.2;
      }

      // Length and detail bonus
      if (reviewText.length > 200) {
        helpfulnessScore += 0.1;
      }

      // Cap at 1.0
      return Math.min(helpfulnessScore, 1.0);
    } catch (error) {
      console.error('ReviewAgent: Error scoring review helpfulness:', error);
      return 0.5; // Default neutral score
    }
  }
}

export const reviewAgent = new ReviewAgent();
