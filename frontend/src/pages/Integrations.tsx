import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import IntegrationsManager from '@/components/IntegrationsManager';

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Integrations</h1>
            <p className="text-muted-foreground">
              Connect external services to add powerful features to your generated websites.
              Your API keys are encrypted and stored securely.
            </p>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold mb-1">How Integrations Work</h3>
                <p className="text-sm text-muted-foreground">
                  When you connect an integration (like Stripe), your API keys will be automatically 
                  injected into any new websites you generate. This means your websites will have 
                  working payment buttons, analytics, and more - without any manual setup!
                </p>
              </div>
            </div>
          </div>

          {/* Integrations Manager */}
          <IntegrationsManager />

          {/* Help Section */}
          <div className="mt-12 p-6 bg-muted/30 rounded-lg">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• <strong>Stripe:</strong> Get your API keys from <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Stripe Dashboard → API Keys</a></li>
              <li>• <strong>Google Analytics:</strong> Find your Measurement ID in <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GA4 → Admin → Data Streams</a></li>
              <li>• <strong>Twilio:</strong> Get credentials from <a href="https://www.twilio.com/console" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Twilio Console</a></li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

