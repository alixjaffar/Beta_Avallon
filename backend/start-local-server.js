// Start local server for generated websites
const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const port = 3001;

// Store running processes and their ports
const runningProcesses = new Map();
const websitePorts = new Map();

// Serve static files from generated-websites directory
app.use(express.static(path.join(__dirname, 'generated-websites')));

// Serve individual websites
app.get('/:websiteName', (req, res) => {
  const websiteName = req.params.websiteName;
  const websitePath = path.join(__dirname, 'generated-websites', websiteName);
  
  // Check for static files first
  const indexPath = path.join(websitePath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
    return;
  }
  
  // Check if it's a Next.js project
  const packageJsonPath = path.join(websitePath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    // It's a Next.js project - start it if not already running
    if (!runningProcesses.has(websiteName)) {
      startNextJsApp(websiteName, websitePath);
    }
    
    // Get the port for this website
    const port = websitePorts.get(websiteName) || 3002;
    
    // Redirect to the actual Next.js app
    res.redirect(`http://localhost:${port}`);
  } else {
    res.status(404).json({ error: 'Website not found' });
  }
});

function startNextJsApp(websiteName, websitePath) {
  console.log(`Starting Next.js app for ${websiteName}...`);
  
  // Calculate port for this website - use a unique port
  const port = 3002 + runningProcesses.size;
  websitePorts.set(websiteName, port);
  
  // Check if dependencies are already installed
  const nodeModulesPath = path.join(websitePath, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    startDevServer(websiteName, websitePath, port);
  } else {
    // Install dependencies first
    const installProcess = spawn('npm', ['install'], {
      cwd: websitePath,
      stdio: 'pipe'
    });
    
    installProcess.on('close', (code) => {
      if (code === 0) {
        startDevServer(websiteName, websitePath, port);
      } else {
        console.error(`Failed to install dependencies for ${websiteName}`);
      }
    });
  }
}

function startDevServer(websiteName, websitePath, port) {
  // Start the Next.js dev server
  const devProcess = spawn('npm', ['run', 'dev'], {
    cwd: websitePath,
    stdio: 'pipe',
    env: { ...process.env, PORT: port }
  });
  
  runningProcesses.set(websiteName, devProcess);
  
  devProcess.stdout.on('data', (data) => {
    console.log(`[${websiteName}] ${data}`);
  });
  
  devProcess.stderr.on('data', (data) => {
    console.error(`[${websiteName}] ${data}`);
  });
  
  devProcess.on('close', (code) => {
    console.log(`Next.js app for ${websiteName} stopped with code ${code}`);
    runningProcesses.delete(websiteName);
    websitePorts.delete(websiteName);
  });
}

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('Stopping all running processes...');
  runningProcesses.forEach((process, name) => {
    console.log(`Stopping ${name}...`);
    process.kill();
  });
  process.exit();
});

app.listen(port, () => {
  console.log(`Local website server running on http://localhost:${port}`);
});
