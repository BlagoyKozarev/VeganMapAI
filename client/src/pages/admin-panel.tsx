import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  Database, 
  RefreshCw,
  CheckCircle,
  Clock,
  TrendingUp,
  Settings,
  Save
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

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

interface ScoringWeights {
  id: string;
  name: string;
  menuVarietyWeight: number;
  ingredientClarityWeight: number;
  staffKnowledgeWeight: number;
  crossContaminationWeight: number;
  nutritionalInformationWeight: number;
  allergenManagementWeight: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [refreshInterval] = useState<number>(30000);
  const [weights, setWeights] = useState({
    menuVarietyWeight: 0.25,
    ingredientClarityWeight: 0.20,
    staffKnowledgeWeight: 0.15,
    crossContaminationWeight: 0.20,
    nutritionalInformationWeight: 0.10,
    allergenManagementWeight: 0.10
  });

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

  // Current active weights
  const { data: activeWeights } = useQuery<ScoringWeights>({
    queryKey: ["/api/admin/scoring-weights"],
    refetchInterval: refreshInterval,
  });

  // Update weights mutation
  const updateWeightsMutation = useMutation({
    mutationFn: async (newWeights: typeof weights) => {
      return apiRequest("/api/admin/scoring-weights", "POST", newWeights);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Scoring weights updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/scoring-weights"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update scoring weights",
        variant: "destructive",
      });
    },
  });

  const completionPercentage = dbStats ? 
    Math.round((dbStats.withScores / dbStats.totalRestaurants) * 100) : 0;

  const cacheHitRate = cacheStats ? 
    Math.round(cacheStats.cacheHitRate * 100) : 0;

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveWeights = () => {
    const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    if (Math.abs(total - 1.0) > 0.001) {
      toast({
        title: "Error",
        description: `Total weights must equal 1.0 (currently ${total.toFixed(3)})`,
        variant: "destructive",
      });
      return;
    }
    updateWeightsMutation.mutate(weights);
  };

  const resetWeights = () => {
    setWeights({
      menuVarietyWeight: 0.25,
      ingredientClarityWeight: 0.20,
      staffKnowledgeWeight: 0.15,
      crossContaminationWeight: 0.20,
      nutritionalInformationWeight: 0.10,
      allergenManagementWeight: 0.10
    });
  };

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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="scoring">AI Scoring</TabsTrigger>
            <TabsTrigger value="weights">Scoring Weights</TabsTrigger>
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

          {/* Scoring Weights Tab */}
          <TabsContent value="weights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>AI Scoring Weights Configuration</span>
                </CardTitle>
                <CardDescription>
                  Adjust the importance of each scoring dimension. Total must equal 1.0 (100%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Menu Variety */}
                  <div className="space-y-2">
                    <Label htmlFor="menuVariety">Menu Variety</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="menuVariety"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={weights.menuVarietyWeight}
                        onChange={(e) => handleWeightChange('menuVarietyWeight', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">
                        ({Math.round(weights.menuVarietyWeight * 100)}%)
                      </span>
                      <div className="flex-1">
                        <Progress value={weights.menuVarietyWeight * 100} />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Quality and variety of vegan menu options
                    </p>
                  </div>

                  {/* Ingredient Clarity */}
                  <div className="space-y-2">
                    <Label htmlFor="ingredientClarity">Ingredient Clarity</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="ingredientClarity"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={weights.ingredientClarityWeight}
                        onChange={(e) => handleWeightChange('ingredientClarityWeight', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">
                        ({Math.round(weights.ingredientClarityWeight * 100)}%)
                      </span>
                      <div className="flex-1">
                        <Progress value={weights.ingredientClarityWeight * 100} />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Clear labeling of ingredients and vegan options
                    </p>
                  </div>

                  {/* Staff Knowledge */}
                  <div className="space-y-2">
                    <Label htmlFor="staffKnowledge">Staff Knowledge</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="staffKnowledge"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={weights.staffKnowledgeWeight}
                        onChange={(e) => handleWeightChange('staffKnowledgeWeight', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">
                        ({Math.round(weights.staffKnowledgeWeight * 100)}%)
                      </span>
                      <div className="flex-1">
                        <Progress value={weights.staffKnowledgeWeight * 100} />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Staff understanding of vegan dietary requirements
                    </p>
                  </div>

                  {/* Cross Contamination */}
                  <div className="space-y-2">
                    <Label htmlFor="crossContamination">Cross-Contamination Prevention</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="crossContamination"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={weights.crossContaminationWeight}
                        onChange={(e) => handleWeightChange('crossContaminationWeight', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">
                        ({Math.round(weights.crossContaminationWeight * 100)}%)
                      </span>
                      <div className="flex-1">
                        <Progress value={weights.crossContaminationWeight * 100} />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Measures to prevent cross-contamination with animal products
                    </p>
                  </div>

                  {/* Nutritional Information */}
                  <div className="space-y-2">
                    <Label htmlFor="nutritionalInfo">Nutritional Information</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="nutritionalInfo"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={weights.nutritionalInformationWeight}
                        onChange={(e) => handleWeightChange('nutritionalInformationWeight', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">
                        ({Math.round(weights.nutritionalInformationWeight * 100)}%)
                      </span>
                      <div className="flex-1">
                        <Progress value={weights.nutritionalInformationWeight * 100} />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Availability of nutritional information for vegan dishes
                    </p>
                  </div>

                  {/* Allergen Management */}
                  <div className="space-y-2">
                    <Label htmlFor="allergenManagement">Allergen Management</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="allergenManagement"
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={weights.allergenManagementWeight}
                        onChange={(e) => handleWeightChange('allergenManagementWeight', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">
                        ({Math.round(weights.allergenManagementWeight * 100)}%)
                      </span>
                      <div className="flex-1">
                        <Progress value={weights.allergenManagementWeight * 100} />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Proper handling and labeling of allergen information
                    </p>
                  </div>
                </div>

                {/* Summary and Actions */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">Total Weight</h4>
                      <p className="text-sm text-muted-foreground">
                        {Object.values(weights).reduce((sum, weight) => sum + weight, 0).toFixed(3)} / 1.000
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={resetWeights}>
                        Reset to Default
                      </Button>
                      <Button 
                        onClick={handleSaveWeights}
                        disabled={updateWeightsMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {updateWeightsMutation.isPending ? "Saving..." : "Save Configuration"}
                      </Button>
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