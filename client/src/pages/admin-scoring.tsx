import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calculator, MapPin } from 'lucide-react';
import { Link } from 'wouter';

interface ScoreCalculationResponse {
  message: string;
  processed: number;
  total: number;
  remaining: number;
}

export default function AdminScoringPage() {
  const { toast } = useToast();
  const [results, setResults] = useState<ScoreCalculationResponse | null>(null);

  // Sofia coordinates
  const sofiaLocation = {
    lat: 42.6977,
    lng: 23.3219
  };

  const expandedRadius = 8; // 8km radius for Sofia center comprehensive loading

  const calculateScoresMutation = useMutation({
    mutationFn: async (): Promise<ScoreCalculationResponse> => {
      const response = await fetch('/api/restaurants/calculate-all-scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sofiaLocation)
      });
      if (!response.ok) throw new Error('Failed to calculate scores');
      return await response.json() as ScoreCalculationResponse;
    },
    onSuccess: (data: ScoreCalculationResponse) => {
      setResults(data);
      toast({
        title: "Scoring Complete",
        description: `Calculated scores for ${data.processed} restaurants`,
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Scoring error:', error);
      toast({
        title: "Scoring Failed",
        description: "Failed to calculate vegan scores. Check console for details.",
        variant: "destructive",
      });
    },
  });

  const populateRestaurantsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/restaurants/populate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...sofiaLocation,
          radius: expandedRadius * 1000
        })
      });
      if (!response.ok) throw new Error('Failed to populate restaurants');
      return await response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Restaurants Loaded",
        description: `Found ${data.count || 'unknown number of'} restaurants in Sofia`,
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Population error:', error);
      toast({
        title: "Population Failed", 
        description: "Failed to load restaurants from Google Places",
        variant: "destructive",
      });
    },
  });

  const progressPercentage = results 
    ? Math.round((results.processed / results.total) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Map
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Vegan Scoring System
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Calculate authentic vegan scores for Sofia restaurants
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Location Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Target Location</span>
            </CardTitle>
            <CardDescription>
              Calculating scores for quality restaurants (rating &gt; 3.0) in Sofia, Bulgaria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                Lat: {sofiaLocation.lat}°
              </Badge>
              <Badge variant="outline">
                Lng: {sofiaLocation.lng}°
              </Badge>
              <Badge variant="outline">
                Radius: {expandedRadius}km
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Load Restaurants</CardTitle>
              <CardDescription>
                Fetch restaurant data from Google Places API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => populateRestaurantsMutation.mutate()}
                disabled={populateRestaurantsMutation.isPending}
                className="w-full"
                variant="outline"
              >
                {populateRestaurantsMutation.isPending ? (
                  <>Loading Restaurants...</>
                ) : (
                  <>Load Sofia Restaurants</>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Step 2: Calculate Scores</span>
              </CardTitle>
              <CardDescription>
                Run AI analysis to generate vegan scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => calculateScoresMutation.mutate()}
                disabled={calculateScoresMutation.isPending}
                className="w-full"
              >
                {calculateScoresMutation.isPending ? (
                  <>Calculating Scores...</>
                ) : (
                  <>Calculate Vegan Scores</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Scoring Results</CardTitle>
              <CardDescription>
                Latest scoring calculation results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {results.processed}
                  </div>
                  <div className="text-sm text-gray-500">Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {results.total}
                  </div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {results.remaining}
                  </div>
                  <div className="text-sm text-gray-500">Remaining</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="w-full" />
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {results.message}
                </p>
              </div>

              {results.remaining > 0 && (
                <Button
                  onClick={() => calculateScoresMutation.mutate()}
                  disabled={calculateScoresMutation.isPending}
                  variant="outline"
                  className="w-full"
                >
                  Continue Scoring ({results.remaining} remaining)
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How Vegan Scoring Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-sm">Data Sources</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Google Places API reviews</li>
                  <li>• Restaurant website data</li>
                  <li>• Cuisine type analysis</li>
                  <li>• Photo analysis (when available)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm">Scoring Dimensions</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Menu Variety (25%)</li>
                  <li>• Ingredient Clarity (20%)</li>
                  <li>• Cross-contamination Prevention (20%)</li>
                  <li>• Staff Knowledge (15%)</li>
                  <li>• Nutritional Information (10%)</li>
                  <li>• Allergen Management (10%)</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> Scoring uses GPT-4o for intelligent analysis. 
                Rate limits apply - we process 3 restaurants at a time with delays.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}