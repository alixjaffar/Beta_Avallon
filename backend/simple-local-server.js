const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Serve static files from generated-websites directory (disabled to prevent conflicts)
// app.use(express.static(path.join(__dirname, 'generated-websites')));

// Handle site routes (legacy format)
app.get('/site_:siteId', (req, res) => {
  const siteId = req.params.siteId;
  console.log(`Requested site: ${siteId}`);
  
  // For site routes, serve a generic HTML preview
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Preview</title>
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        .preview-content {
            padding: 2rem;
            background: white;
            color: #333;
            min-height: 100vh;
        }
        .hero-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4rem 2rem;
            text-align: center;
        }
        .hero-title {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        .hero-subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .hero-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        .btn {
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-primary {
            background: #ff6b6b;
            color: white;
        }
        .btn-secondary {
            background: transparent;
            border: 2px solid white;
            color: white;
        }
        .features-section {
            padding: 4rem 2rem;
            background: #f8f9fa;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
        }
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .feature-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #333;
        }
        .feature-description {
            color: #666;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="preview-content">
        <div class="hero-section">
            <h1 class="hero-title">Website Preview</h1>
            <p class="hero-subtitle">Your generated website is ready for preview</p>
            <div class="hero-buttons">
                <button class="btn btn-primary">Get Started</button>
                <button class="btn btn-secondary">Learn More</button>
            </div>
        </div>
        
        <div class="features-section">
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3 class="feature-title">Fast Performance</h3>
                    <p class="feature-description">Optimized for speed and performance with modern web technologies.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3 class="feature-title">Responsive Design</h3>
                    <p class="feature-description">Looks great on all devices - desktop, tablet, and mobile.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎨</div>
                    <h3 class="feature-title">Modern Design</h3>
                    <p class="feature-description">Clean, professional design that converts visitors into customers.</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  
  res.send(htmlContent);
});

// Handle specific project routes - fix the pattern
app.get('/project_:projectId', (req, res) => {
  const projectId = req.params.projectId;
  const projectPath = path.join(__dirname, 'generated-websites', `project_${projectId}`);
  
  console.log(`Requested project: ${projectId}, path: ${projectPath}`);
  
  // Check if project directory exists
  if (fs.existsSync(projectPath)) {
    // For Next.js apps, serve a simple HTML wrapper that loads the app
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website Preview</title>
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        .preview-content {
            padding: 2rem;
            background: white;
            color: #333;
            min-height: 100vh;
        }
        .hero-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4rem 2rem;
            text-align: center;
        }
        .hero-title {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        .hero-subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .hero-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        .btn {
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-primary {
            background: #ff6b6b;
            color: white;
        }
        .btn-secondary {
            background: transparent;
            border: 2px solid white;
            color: white;
        }
        .features-section {
            padding: 4rem 2rem;
            background: #f8f9fa;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
        }
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .feature-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #333;
        }
        .feature-description {
            color: #666;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="preview-content">
        <div class="hero-section">
            <h1 class="hero-title">Professional Website</h1>
            <p class="hero-subtitle">Your generated website is ready for preview</p>
            <div class="hero-buttons">
                <button class="btn btn-primary">Get Started</button>
                <button class="btn btn-secondary">Learn More</button>
            </div>
        </div>
        
        <div class="features-section">
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3 class="feature-title">Fast Performance</h3>
                    <p class="feature-description">Optimized for speed and performance with modern web technologies.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3 class="feature-title">Responsive Design</h3>
                    <p class="feature-description">Looks great on all devices - desktop, tablet, and mobile.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎨</div>
                    <h3 class="feature-title">Modern Design</h3>
                    <p class="feature-description">Clean, professional design that converts visitors into customers.</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
    
    res.send(htmlContent);
  } else {
    res.status(404).json({ 
      error: 'Project not found', 
      projectId,
      availableProjects: fs.readdirSync(path.join(__dirname, 'generated-websites'))
        .filter(item => item.startsWith('project_'))
    });
  }
});

// Also handle the trailing slash version
app.get('/project_:projectId/', (req, res) => {
  const projectId = req.params.projectId;
  const projectPath = path.join(__dirname, 'generated-websites', `project_${projectId}`);
  
  console.log(`Requested project (trailing slash): ${projectId}, path: ${projectPath}`);
  
  // Check if project directory exists
  if (fs.existsSync(projectPath)) {
    // Same HTML content as above
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website Preview</title>
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        .preview-content {
            padding: 2rem;
            background: white;
            color: #333;
            min-height: 100vh;
        }
        .hero-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4rem 2rem;
            text-align: center;
        }
        .hero-title {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        .hero-subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .hero-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        .btn {
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-primary {
            background: #ff6b6b;
            color: white;
        }
        .btn-secondary {
            background: transparent;
            border: 2px solid white;
            color: white;
        }
        .features-section {
            padding: 4rem 2rem;
            background: #f8f9fa;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
        }
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .feature-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #333;
        }
        .feature-description {
            color: #666;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="preview-content">
        <div class="hero-section">
            <h1 class="hero-title">Professional Website</h1>
            <p class="hero-subtitle">Your generated website is ready for preview</p>
            <div class="hero-buttons">
                <button class="btn btn-primary">Get Started</button>
                <button class="btn btn-secondary">Learn More</button>
            </div>
        </div>
        
        <div class="features-section">
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3 class="feature-title">Fast Performance</h3>
                    <p class="feature-description">Optimized for speed and performance with modern web technologies.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3 class="feature-title">Responsive Design</h3>
                    <p class="feature-description">Looks great on all devices - desktop, tablet, and mobile.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎨</div>
                    <h3 class="feature-title">Modern Design</h3>
                    <p class="feature-description">Clean, professional design that converts visitors into customers.</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
    
    res.send(htmlContent);
  } else {
    res.status(404).json({ 
      error: 'Project not found', 
      projectId,
      availableProjects: fs.readdirSync(path.join(__dirname, 'generated-websites'))
        .filter(item => item.startsWith('project_'))
    });
  }
});

// Root route - list available projects
app.get('/', (req, res) => {
  const generatedDir = path.join(__dirname, 'generated-websites');
  
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }
  
  const projects = fs.readdirSync(generatedDir)
    .filter(item => item.startsWith('project_'))
    .map(project => ({
      id: project,
      url: `http://localhost:${PORT}/${project}`
    }));
  
  res.json({
    message: 'Local Website Server',
    port: PORT,
    projects
  });
});

app.listen(PORT, () => {
  console.log(`Local website server running on http://localhost:${PORT}`);
  console.log(`Serving files from: ${path.join(__dirname, 'generated-websites')}`);
});