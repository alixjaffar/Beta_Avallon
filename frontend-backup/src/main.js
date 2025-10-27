// Simple JavaScript test without TypeScript
console.log('main.js is loading...');

const rootElement = document.getElementById("root");
console.log('Root element:', rootElement);

if (rootElement) {
  rootElement.innerHTML = `
    <div style="min-height: 100vh; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif;">
      <div style="text-align: center; padding: 2rem;">
        <h1 style="font-size: 2.5rem; font-weight: bold; color: #1f2937; margin-bottom: 1rem;">
          🚀 Avallon Cloud Frontend
        </h1>
        <p style="font-size: 1.25rem; color: #6b7280; margin-bottom: 2rem;">
          Frontend is working! JavaScript is working.
        </p>
        <div style="background-color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); max-width: 28rem; margin: 0 auto;">
          <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">System Status</h2>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="display: flex; justify-content: space-between;">
              <span>Frontend:</span>
              <span style="color: #10b981;">✅ Working</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>JavaScript:</span>
              <span style="color: #10b981;">✅ Working</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Vite:</span>
              <span style="color: #10b981;">✅ Working</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  console.log('JavaScript execution successful!');
} else {
  console.error('Root element not found!');
}
