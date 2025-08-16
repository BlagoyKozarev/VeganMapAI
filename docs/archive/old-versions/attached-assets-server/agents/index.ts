import { MapAgent } from './mapAgent';
import { SearchAgent } from './searchAgent';
import { ScoreAgent } from './scoreAgent';
import { ReviewAgent } from './reviewAgent';
import { ProfileAgent } from './profileAgent';
import { AnalyticsAgent } from './analyticsAgent';

// Export class definitions
export { MapAgent, SearchAgent, ScoreAgent, ReviewAgent, ProfileAgent, AnalyticsAgent };

// Export instances for use in routes
export const mapAgent = new MapAgent();
export const searchAgent = new SearchAgent();
export const scoreAgent = new ScoreAgent();
export const reviewAgent = new ReviewAgent();
export const profileAgent = new ProfileAgent();
export const analyticsAgent = new AnalyticsAgent();
