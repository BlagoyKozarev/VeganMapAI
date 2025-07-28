import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ApiStats {
  apiCalls: {
    placesSearch: number;
    placeDetails: number;
    photos: number;
    total: number;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
    totalRequests: number;
    sizes: {
      places: { size: number };
      details: { size: number };
      photos: { size: number };
    };
  };
  costOptimization: {
    estimatedSavings: string;
    potentialCosts: string;
    actualCosts: string;
    savingsPercentage: string;
  };
}

export default function ApiStatsPage() {
  const { data: stats, isLoading, refetch } = useQuery<ApiStats>({
    queryKey: ['/api/stats/usage'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const clearCache = async () => {
    try {
      const response = await fetch('/api/stats/clear-cache', {
        method: 'POST',
      });
      
      if (response.ok) {
        alert('Cache cleared successfully');
        refetch();
      }
    } catch (error) {
      alert('Failed to clear cache');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-vegan-green rounded-full animate-pulse mb-4"></div>
          <p className="text-gray-600">Loading API statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">API Cost Optimization</h1>
            <p className="text-gray-600 mt-2">Monitor Google Places API usage and caching efficiency</p>
          </div>
          <Button onClick={clearCache} variant="outline">
            Clear Cache
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* API Calls Stats */}
          <Card>
            <CardHeader>
              <CardTitle>API Calls Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Places Search:</span>
                  <span className="font-semibold">{stats?.apiCalls?.placesSearch || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Place Details:</span>
                  <span className="font-semibold">{stats?.apiCalls?.placeDetails || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Photos:</span>
                  <span className="font-semibold">{stats?.apiCalls?.photos || 0}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-bold text-blue-600">{stats?.apiCalls?.total || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cache Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Cache Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cache Hits:</span>
                  <span className="font-semibold text-green-600">{stats?.cache?.hits || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cache Misses:</span>
                  <span className="font-semibold text-red-600">{stats?.cache?.misses || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hit Rate:</span>
                  <span className="font-semibold">{stats?.cache?.hitRate?.toFixed(1) || '0.0'}%</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold text-gray-900">Total Requests:</span>
                  <span className="font-bold">{stats?.cache?.totalRequests || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Savings */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Potential Cost:</span>
                  <span className="font-semibold">{stats?.costOptimization?.potentialCosts || '$0.0000'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Actual Cost:</span>
                  <span className="font-semibold">{stats?.costOptimization?.actualCosts || '$0.0000'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Savings:</span>
                  <span className="font-semibold text-green-600">{stats?.costOptimization?.estimatedSavings || '$0.0000'}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold text-gray-900">Savings %:</span>
                  <span className="font-bold text-green-600">{stats?.costOptimization?.savingsPercentage || '0%'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cache Sizes */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Cache Storage Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {stats?.cache?.sizes?.places?.size || 0}
                  </div>
                  <div className="text-sm text-gray-600">Places Cache Entries</div>
                  <div className="text-xs text-gray-500 mt-1">Geographic search results</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {stats?.cache?.sizes?.details?.size || 0}
                  </div>
                  <div className="text-sm text-gray-600">Details Cache Entries</div>
                  <div className="text-xs text-gray-500 mt-1">Restaurant details & info</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">
                    {stats?.cache?.sizes?.photos?.size || 0}
                  </div>
                  <div className="text-sm text-gray-600">Photos Cache Entries</div>
                  <div className="text-xs text-gray-500 mt-1">Restaurant photos & images</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cache Efficiency Analysis */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Cost Optimization Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Current Performance</h3>
                    <ul className="space-y-2 text-sm">
                      <li>✓ {stats?.cache?.hitRate?.toFixed(1) || '0.0'}% cache hit rate achieved</li>
                      <li>✓ {stats?.costOptimization?.savingsPercentage || '0%'} cost reduction</li>
                      <li>✓ {stats?.cache?.hits || 0} API calls avoided today</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Target Goals</h3>
                    <ul className="space-y-2 text-sm">
                      <li>→ Target: 90% cache hit rate for Places API</li>
                      <li>→ Goal: 50-90% cost reduction through caching</li>
                      <li>→ Scale: Optimize for US expansion to 20 cities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {!stats && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* API Calls Stats */}
            <Card>
              <CardHeader>
                <CardTitle>API Calls Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Places Search:</span>
                    <span className="font-semibold">{stats.apiCalls.placesSearch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Place Details:</span>
                    <span className="font-semibold">{stats.apiCalls.placeDetails}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Photos:</span>
                    <span className="font-semibold">{stats.apiCalls.photos}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-blue-600">{stats.apiCalls.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cache Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Cache Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cache Hits:</span>
                    <span className="font-semibold text-green-600">{stats.cache.hits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cache Misses:</span>
                    <span className="font-semibold text-red-600">{stats.cache.misses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hit Rate:</span>
                    <span className="font-semibold">{stats.cache.hitRate?.toFixed(1) || '0.0'}%</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-semibold text-gray-900">Total Requests:</span>
                    <span className="font-bold">{stats.cache.totalRequests}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Savings */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Potential Cost:</span>
                    <span className="font-semibold">{stats.costOptimization.potentialCosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Actual Cost:</span>
                    <span className="font-semibold">{stats.costOptimization.actualCosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Savings:</span>
                    <span className="font-semibold text-green-600">{stats.costOptimization.estimatedSavings}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-semibold text-gray-900">Savings %:</span>
                    <span className="font-bold text-green-600">{stats.costOptimization.savingsPercentage}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cache Sizes */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Cache Storage Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {stats.cache.sizes.places.size}
                    </div>
                    <div className="text-sm text-gray-600">Places Cache Entries</div>
                    <div className="text-xs text-gray-500 mt-1">Geographic search results</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {stats.cache.sizes.details.size}
                    </div>
                    <div className="text-sm text-gray-600">Details Cache Entries</div>
                    <div className="text-xs text-gray-500 mt-1">Restaurant details & info</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">
                      {stats.cache.sizes.photos.size}
                    </div>
                    <div className="text-sm text-gray-600">Photos Cache Entries</div>
                    <div className="text-xs text-gray-500 mt-1">Restaurant photos & images</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cache Efficiency Analysis */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Cost Optimization Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Current Performance</h3>
                      <ul className="space-y-2 text-sm">
                        <li>✓ {stats.cache.hitRate?.toFixed(1) || '0.0'}% cache hit rate achieved</li>
                        <li>✓ {stats.costOptimization.savingsPercentage} cost reduction</li>
                        <li>✓ {stats.cache.hits} API calls avoided today</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Target Goals</h3>
                      <ul className="space-y-2 text-sm">
                        <li>→ Target: 90% cache hit rate for Places API</li>
                        <li>→ Goal: 50-90% cost reduction through caching</li>
                        <li>→ Scale: Optimize for US expansion to 20 cities</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}