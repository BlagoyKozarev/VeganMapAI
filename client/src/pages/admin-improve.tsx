import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ImproveResult {
  name: string;
  oldScore: number;
  newScore: number;
  reasoning?: string;
  error?: string;
}

interface ImproveResponse {
  success: boolean;
  processed: number;
  improved: number;
  results: ImproveResult[];
  message: string;
}

export default function AdminImprove() {
  const { toast } = useToast();
  const [batchSize, setBatchSize] = useState(10);
  const [onlyLowScores, setOnlyLowScores] = useState(true);

  const improveMutation = useMutation({
    mutationFn: async ({ batchSize, onlyLowScores }: { batchSize: number; onlyLowScores: boolean }) => {
      const response = await fetch('/api/admin/improve-scoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ batchSize, onlyLowScores }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json() as ImproveResponse;
    },
    onSuccess: (data) => {
      toast({
        title: "Scoring Improved Successfully",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImprove = () => {
    improveMutation.mutate({ batchSize, onlyLowScores });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Improve AI Scoring System
          </h1>
          <p className="text-gray-600">
            Update vegan scores with improved algorithm
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Scoring Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of restaurants to process:
              </label>
              <input
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(parseInt(e.target.value))}
                className="w-full p-2 border rounded-md"
                min="1"
                max="50"
              />
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={onlyLowScores}
                  onChange={(e) => setOnlyLowScores(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Only restaurants with low scores (&lt; 2.0)</span>
              </label>
            </div>

            <Button
              onClick={handleImprove}
              disabled={improveMutation.isPending}
              className="w-full"
            >
              {improveMutation.isPending ? 'Processing...' : 'Start Improvement'}
            </Button>
          </CardContent>
        </Card>

        {improveMutation.data && (
          <Card>
            <CardHeader>
              <CardTitle>Резултати от подобряването</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 font-medium">
                  {improveMutation.data.message}
                </p>
                <p className="text-green-600 text-sm mt-1">
                  Обработени: {improveMutation.data.processed} | 
                  Подобрени: {improveMutation.data.improved}
                </p>
              </div>
              
              <div className="space-y-3">
                {improveMutation.data.results.map((result, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{result.name}</h4>
                      {result.error ? (
                        <span className="text-red-600 text-sm">Грешка</span>
                      ) : (
                        <span className="text-green-600 text-sm">
                          {result.oldScore.toFixed(1)} → {result.newScore.toFixed(1)}
                        </span>
                      )}
                    </div>
                    
                    {result.reasoning && (
                      <p className="text-gray-600 text-sm">{result.reasoning}</p>
                    )}
                    
                    {result.error && (
                      <p className="text-red-600 text-sm">{result.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}