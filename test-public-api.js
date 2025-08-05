// Quick test for public API endpoint
async function testPublicAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/restaurants/public/map-data');
    const data = await response.json();
    
    console.log('API Response Status:', response.status);
    console.log('Success:', data.success);
    console.log('Total restaurants:', data.count);
    console.log('Is public endpoint:', data.public);
    
    if (data.restaurants && data.restaurants.length > 0) {
      console.log('\nSample Sofia restaurants:');
      const sofiaRestaurants = data.restaurants.filter(r => {
        const lat = parseFloat(r.latitude);
        const lng = parseFloat(r.longitude);
        return lat >= 42.6 && lat <= 42.8 && lng >= 23.2 && lng <= 23.4;
      });
      
      console.log('Sofia restaurants found:', sofiaRestaurants.length);
      console.log('\nFirst 3 Sofia restaurants:');
      sofiaRestaurants.slice(0, 3).forEach((r, i) => {
        console.log(`${i + 1}. ${r.name} - Score: ${r.veganScore}, Address: ${r.address}`);
      });
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testPublicAPI();