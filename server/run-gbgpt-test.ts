import { testGBGPTConnection } from './test-gbgpt-simple';

// Run the test
testGBGPTConnection().then(result => {
  if (result.success) {
    console.log('🎉 GBGPT test passed!');
  } else {
    console.log('❌ GBGPT test failed!');
  }
  process.exit(result.success ? 0 : 1);
});