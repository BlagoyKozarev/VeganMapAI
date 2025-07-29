import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Database, 
  RefreshCw,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";

interface DatabaseStats {
  totalRestaurants: number;
  withScores: number;
  pendingScores: number;
  avgVeganScore: number;
  highVeganFriendly: number;
  mediumVeganFriendly: number;
  lowVeganFriendly: number;
  recentlyAdded: number;
}

interface CacheStats {
  placesSearchHits: number;
  placesSearchMisses: number;
  placeDetailsHits: number;
  placeDetailsMisses: number;
  photosHits: number;
  photosMisses: number;
  totalSavings: number;
  cacheHitRate: number;
}

interface ScoringJob {
  id: string;
  status: 'running' | 'completed' | 'paused' | 'error';
  totalRestaurants: number;
  completedRestaurants: number;
  estimatedCompletion: string;
  startedAt: string;
}

export default function AdminPanel() {
  const [refreshInterval] = useState<number>(30000);

  // Database statistics
  const { data: dbStats, isLoading: dbLoading } = useQuery<DatabaseStats>({
    queryKey: ["/api/admin/database-stats"],
    refetchInterval: refreshInterval,
  });

  // Cache statistics
  const { data: cacheStats, isLoading: cacheLoading } = useQuery<CacheStats>({
    queryKey: ["/api/admin/cache-stats"],
    refetchInterval: refreshInterval,
  });

  // Scoring job status
  const { data: scoringJob, isLoading: scoringLoading } = useQuery<ScoringJob>({
    queryKey: ["/api/admin/scoring-status"],
    refetchInterval: 10000,
  });

  const completionPercentage = dbStats ? 
    Math.round((dbStats.withScores / dbStats.totalRestaurants) * 100) : 0;

  const cacheHitRate = cacheStats ? 
    Math.round(cacheStats.cacheHitRate * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            VeganMapAI Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive platform management and monitoring
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="scoring">AI Scoring</TabsTrigger>
            <TabsTrigger value="cache">Cache Management</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Restaurants */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dbStats?.totalRestaurants || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{dbStats?.recentlyAdded || 0} recently added
                  </p>
                </CardContent>
              </Card>

              {/* AI Scoring Progress */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Scoring Progress</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completionPercentage}%</div>
                  <Progress value={completionPercentage} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {dbStats?.withScores}/{dbStats?.totalRestaurants} completed
                  </p>
                </CardContent>
              </Card>

              {/* Average Vegan Score */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Vegan Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dbStats?.avgVeganScore?.toFixed(2) || "0.00"}/10
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all scored restaurants
                  </p>
                </CardContent>
              </Card>

              {/* Cache Hit Rate */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cacheHitRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    ${cacheStats?.totalSavings?.toFixed(2) || "0.00"} saved
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Vegan Friendliness Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Vegan Friendliness Distribution</CardTitle>
                <CardDescription>
                  Restaurant categorization by vegan score ranges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <div>
                      <p className="text-sm font-medium">High (7.0+ score)</p>
                      <p className="text-2xl font-bold">{dbStats?.highVeganFriendly || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-yellow-500"></div>
                    <div>
                      <p className="text-sm font-medium">Medium (4.0-6.9)</p>
                      <p className="text-2xl font-bold">{dbStats?.mediumVeganFriendly || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-red-500"></div>
                    <div>
                      <p className="text-sm font-medium">Low (0.1-3.9)</p>
                      <p className="text-2xl font-bold">{dbStats?.lowVeganFriendly || 0}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Scoring Job Status */}
            {scoringJob && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {scoringJob.status === 'running' && <Clock className="h-5 w-5 text-blue-500" />}
                    {scoringJob.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    <span>Current Scoring Job</span>
                    <Badge variant={scoringJob.status === 'running' ? 'default' : 'secondary'}>
                      {scoringJob.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{scoringJob.completedRestaurants}/{scoringJob.totalRestaurants}</span>
                      </div>
                      <Progress 
                        value={(scoringJob.completedRestaurants / scoringJob.totalRestaurants) * 100} 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Started at</p>
                        <p className="font-medium">{new Date(scoringJob.startedAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Est. completion</p>
                        <p className="font-medium">{scoringJob.estimatedCompletion}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Statistics</CardTitle>
                <CardDescription>Current database state and coverage metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold">{dbStats?.totalRestaurants || 0}</div>
                    <div className="text-sm text-muted-foreground">Total Restaurants</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold">{dbStats?.withScores || 0}</div>
                    <div className="text-sm text-muted-foreground">With AI Scores</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold">{dbStats?.pendingScores || 0}</div>
                    <div className="text-sm text-muted-foreground">Pending Scores</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold">{Math.round((dbStats?.totalRestaurants || 0) / 514 * 100)}%</div>
                    <div className="text-sm text-muted-foreground">Sofia Coverage</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Scoring Tab */}
          <TabsContent value="scoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Scoring System Status</CardTitle>
                <CardDescription>Monitor AI vegan scoring progress and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Scoring Progress</h4>
                      <div className="mt-2">
                        <Progress value={completionPercentage} />
                        <p className="text-sm text-muted-foreground mt-1">
                          {dbStats?.withScores || 0} of {dbStats?.totalRestaurants || 0} restaurants scored
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">Average Score</h4>
                      <div className="text-3xl font-bold mt-2">
                        {dbStats?.avgVeganScore?.toFixed(2) || "0.00"}/10
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Across {dbStats?.withScores || 0} scored restaurants
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cache Management Tab */}
          <TabsContent value="cache" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cache Performance</CardTitle>
                <CardDescription>Monitor and manage API caching performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Places Search</h4>
                    <div className="text-sm text-muted-foreground">
                      Hits: {cacheStats?.placesSearchHits || 0} | 
                      Misses: {cacheStats?.placesSearchMisses || 0}
                    </div>
                    <Progress 
                      value={cacheStats ? (cacheStats.placesSearchHits / (cacheStats.placesSearchHits + cacheStats.placesSearchMisses)) * 100 : 0} 
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Place Details</h4>
                    <div className="text-sm text-muted-foreground">
                      Hits: {cacheStats?.placeDetailsHits || 0} | 
                      Misses: {cacheStats?.placeDetailsMisses || 0}
                    </div>
                    <Progress 
                      value={cacheStats ? (cacheStats.placeDetailsHits / (cacheStats.placeDetailsHits + cacheStats.placeDetailsMisses)) * 100 : 0} 
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Photos</h4>
                    <div className="text-sm text-muted-foreground">
                      Hits: {cacheStats?.photosHits || 0} | 
                      Misses: {cacheStats?.photosMisses || 0}
                    </div>
                    <Progress 
                      value={cacheStats ? (cacheStats.photosHits / (cacheStats.photosHits + cacheStats.photosMisses)) * 100 : 0} 
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-2">Cost Savings</h4>
                  <div className="text-2xl font-bold text-green-600">
                    ${cacheStats?.totalSavings?.toFixed(2) || "0.00"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total API costs saved through intelligent caching
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}