async function testProductionComplete() {
  console.log("🔍 Complete Production Test\n");
  
  const baseUrl = "https://vegan-map-ai-bkozarev.replit.app";
  
  // Test endpoints
  const endpoints = [
    "/api/restaurants/public/map-data",
    "/api/health", 
    "/api/restaurants"
  ];
  
  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint}...`);
    try {
      const response = await fetch(baseUrl + endpoint);
      const contentType = response.headers.get("content-type");
      
      console.log(`  Status: ${response.status}`);
      console.log(`  Content-Type: ${contentType}`);
      
      if (contentType?.includes("application/json")) {
        const data = await response.json();
        console.log(`  Response:`, JSON.stringify(data, null, 2).substring(0, 200) + "...");
      } else {
        const text = await response.text();
        console.log(`  Response: HTML page (${text.length} characters)`);
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
    console.log("");
  }
}

testProductionComplete();