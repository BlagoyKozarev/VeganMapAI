import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface MapControlsProps {
  onViewModeChange: (mode: 'standard' | 'satellite' | 'terrain') => void;
  onShowTrafficChange: (show: boolean) => void;
  onShowTransitChange: (show: boolean) => void;
  onScoreFilterChange: (minScore: number) => void;
  onRadiusChange: (radius: number) => void;
  currentViewMode: string;
  showTraffic: boolean;
  showTransit: boolean;
  minScore: number;
  radius: number;
}

export default function MapControls({
  onViewModeChange,
  onShowTrafficChange,
  onShowTransitChange,
  onScoreFilterChange,
  onRadiusChange,
  currentViewMode,
  showTraffic,
  showTransit,
  minScore,
  radius
}: MapControlsProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded for testing

  return (
    <div className="fixed top-20 right-4" style={{ zIndex: 2000 }}>
      <Card className="bg-white shadow-xl border-2 border-blue-300">
        <CardContent className="p-4">
          {/* Toggle Button */}
          <Button
            variant="default"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mb-2 flex items-center justify-between bg-blue-500 hover:bg-blue-600 text-white"
          >
            <span className="text-sm font-medium">🗺️ Map Controls</span>
            <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </Button>

          {isExpanded && (
            <div className="space-y-4 min-w-[280px]">
              {/* Map View Mode */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Map Style</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={currentViewMode === 'standard' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onViewModeChange('standard')}
                    className="text-xs"
                  >
                    Standard
                  </Button>
                  <Button
                    variant={currentViewMode === 'satellite' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onViewModeChange('satellite')}
                    className="text-xs"
                  >
                    Satellite
                  </Button>
                  <Button
                    variant={currentViewMode === 'terrain' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onViewModeChange('terrain')}
                    className="text-xs"
                  >
                    Terrain
                  </Button>
                </div>
              </div>

              {/* Layer Controls */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Map Layers</Label>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="traffic" className="text-sm">Traffic</Label>
                  <Switch
                    id="traffic"
                    checked={showTraffic}
                    onCheckedChange={onShowTrafficChange}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="transit" className="text-sm">Public Transit</Label>
                  <Switch
                    id="transit"
                    checked={showTransit}
                    onCheckedChange={onShowTransitChange}
                  />
                </div>
              </div>

              {/* Vegan Score Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Min Vegan Score: {minScore}/10
                </Label>
                <Slider
                  value={[minScore]}
                  onValueChange={(value) => onScoreFilterChange(value[0])}
                  max={10}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>

              {/* Search Radius */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Search Radius: {radius}km
                </Label>
                <Slider
                  value={[radius]}
                  onValueChange={(value) => onRadiusChange(value[0])}
                  max={10}
                  min={0.5}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5km</span>
                  <span>5km</span>
                  <span>10km</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 border-t">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onScoreFilterChange(0);
                      onRadiusChange(2);
                    }}
                    className="text-xs"
                  >
                    Reset Filters
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onScoreFilterChange(7);
                      onRadiusChange(1);
                    }}
                    className="text-xs"
                  >
                    High Quality
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}