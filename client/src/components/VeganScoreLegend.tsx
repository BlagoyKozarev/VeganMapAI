export default function VeganScoreLegend() {
  const scoreRanges = [
    { range: '8.5-10', label: 'Excellent', color: 'bg-green-600', textColor: 'text-white' },
    { range: '7.5-8.4', label: 'Very Good', color: 'bg-green-500', textColor: 'text-white' },
    { range: '6.0-7.4', label: 'Good', color: 'bg-yellow-500', textColor: 'text-black' },
    { range: '4.5-5.9', label: 'Fair', color: 'bg-orange-500', textColor: 'text-white' },
    { range: '3.0-4.4', label: 'Poor', color: 'bg-red-500', textColor: 'text-white' },
    { range: '<3.0', label: 'Very Poor', color: 'bg-red-600', textColor: 'text-white' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg border p-4 w-48">
      <h3 className="font-bold text-sm mb-3 text-gray-800">Vegan Score Legend</h3>
      <div className="space-y-2">
        {scoreRanges.map((range) => (
          <div key={range.range} className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${range.color} flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-700">{range.label}</div>
              <div className="text-xs text-gray-500">{range.range}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Based on menu variety, ingredient clarity, staff knowledge, and allergen management
        </p>
      </div>
    </div>
  )
}