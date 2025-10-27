// Local server for serving generated websites
import express from 'express';
import path from 'path';
import { logInfo } from './log';

let server: any = null;

export function startLocalServer() {
  if (server) {
    logInfo('Local server already running');
    return;
  }

  const app = express();
  const port = 3001;

  // Serve static files from generated-websites directory
  app.use(express.static(path.join(process.cwd(), 'generated-websites')));

  // Serve individual websites
  app.get('/:websiteName', (req, res) => {
    const websiteName = req.params.websiteName;
    const websitePath = path.join(process.cwd(), 'generated-websites', websiteName);
    
    // Try to serve the website's index.html or main page
    const indexPath = path.join(websitePath, 'index.html');
    const appPath = path.join(websitePath, 'app', 'page.tsx');
    
    if (require('fs').existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else if (require('fs').existsSync(appPath)) {
      // For Next.js apps, we need to run them with npm
      res.json({
        message: 'Next.js website detected',
        instructions: `To run this website locally, navigate to: ${websitePath} and run: npm install && npm run dev`,
        path: websitePath
      });
    } else {
      res.status(404).json({ error: 'Website not found' });
    }
  });

  server = app.listen(port, () => {
    logInfo(`Local website server running on http://localhost:${port}`);
  });
}

export function stopLocalServer() {
  if (server) {
    server.close();
    server = null;
    logInfo('Local server stopped');
  }
}
