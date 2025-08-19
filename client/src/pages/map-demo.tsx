import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MapComponent from '@/components/Map';

export default function MapDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Google Maps Demo
              </h1>
              <p className="text-gray-600 mt-1">
                CDN-powered restaurant map with real-time data
              </p>
            </div>
          </div>
        </div>

        {/* Map Demo Card */}
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Interactive Restaurant Map
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>High Vegan Score (7+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Medium Vegan Score (4-7)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Low Vegan Score (0-4)</span>
              </div>
            </div>
          </div>
          
          {/* Map Component */}
          <div className="border rounded-lg overflow-hidden">
            <MapComponent />
          </div>
          
          {/* Info Panel */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Features:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Data loaded from Global CDN: https://storage.googleapis.com/veganmapai-cdn/geojson/sofia.geojson</li>
              <li>• 511 Sofia restaurants with vegan scores</li>
              <li>• Color-coded markers based on vegan friendliness</li>
              <li>• Click markers for detailed restaurant information</li>
              <li>• Fast global loading with 24-hour cache</li>
            </ul>
          </div>
        </Card>

        {/* Technical Details */}
        <Card className="mt-6 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Technical Implementation
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Data Source</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• GeoJSON format (RFC 7946 compliant)</li>
                <li>• Google Cloud Storage CDN</li>
                <li>• 354KB total size, 511 restaurants</li>
                <li>• Global distribution network</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 24-hour immutable cache headers</li>
                <li>• &lt;200ms response time globally</li>
                <li>• No database queries for map rendering</li>
                <li>• Optimized marker clustering</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}