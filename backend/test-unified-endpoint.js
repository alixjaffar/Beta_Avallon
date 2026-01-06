/**
 * Test the new unified generation endpoint
 */

async function test() {
  try {
    console.log('🧪 Testing /api/generate/unified endpoint...\n');
    
    const response = await fetch('http://localhost:3000/api/generate/unified', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Create a simple barbershop website with services and pricing',
        name: 'Test Barbershop'
      })
    });
    
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response success:', data.success);
    
    if (!response.ok) {
      console.log('❌ Error:', data.error || data.message);
      console.log('Details:', data.details || data);
      return;
    }
    
    console.log('\n✅ Generation successful!');
    console.log('Project:', data.project?.name);
    console.log('Spec pages:', data.spec?.pages?.length || 0);
    console.log('Generated files:', data.fileMap ? Object.keys(data.fileMap).length : 0);
    console.log('Files:', data.fileMap ? Object.keys(data.fileMap).slice(0, 5).join(', ') + '...' : 'none');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

test();


