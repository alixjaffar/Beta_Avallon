import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Always go back to auth page to ensure user can continue signup
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <span className="text-muted-foreground">or</span>
            <Button
              variant="link"
              onClick={() => navigate('/auth')}
              className="p-0"
            >
              Return to Sign Up
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Avallon Terms of Use</h1>
          <p className="text-muted-foreground mt-2">Effective Date: January 2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Avallon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              By accessing or using our website, beta platform, or related services ("Services"), 
              you agree to these Terms of Use ("Terms"). If you do not agree, please do not use our Services.
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. About Avallon</h2>
              <p>
                Avallon operates at the intersection of business, law, and technology. Our platform, 
                tools, and related materials (collectively, "Avallon Platform") are proprietary to 
                Avallon Technologies Inc. ("Avallon", "we", "our", or "us").
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Beta Use and Access</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Our Services are currently in beta. Features and functionality may change, be interrupted, or discontinued at any time.</li>
                <li>Access is provided as-is, without guarantees of performance, uptime, or availability.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p>If you create an account:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>You must provide accurate information and maintain its confidentiality.</li>
                <li>You are responsible for all activity under your account.</li>
                <li>You may not share login credentials or access with others without written permission.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Intellectual Property</h2>
              <p>All content, design, code, features, and concepts of the Avallon Platform are proprietary and confidential.</p>
              <p className="mt-2">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Copy, reproduce, reverse-engineer, or modify any part of Avallon's technology or business model.</li>
                <li>Use Avallon's name, logo, or materials without written authorization.</li>
              </ul>
              <p className="mt-2">All rights not expressly granted are reserved by Avallon.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Confidentiality</h2>
              <p>
                By accessing the beta, you acknowledge that you may view or interact with proprietary 
                concepts not yet publicly released.
              </p>
              <p className="mt-2">
                You agree not to disclose or share any non-public information about Avallon's 
                systems, methods, or plans.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Acceptable Use</h2>
              <p>You agree not to use Avallon to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Violate any laws or regulations,</li>
                <li>Interfere with the operation or security of our systems,</li>
                <li>Attempt unauthorized access to other accounts or data.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Disclaimer and Limitation of Liability</h2>
              <p>Avallon provides its Services "as is" without warranties of any kind.</p>
              <p className="mt-2">To the maximum extent permitted by law:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Avallon is not liable for any loss, damage, or data issues arising from use of the beta.</li>
                <li>Use is at your own risk.</li>
              </ul>
              <p className="mt-2">
                This beta is for evaluation purposes and should not be relied on for professional, 
                legal, or financial decision-making.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Termination</h2>
              <p>
                We may suspend or terminate access at any time, without notice, for any reason, 
                including suspected misuse or security risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the Province of Ontario and the federal 
                laws of Canada applicable therein.
              </p>
              <p className="mt-2">
                Any disputes shall be resolved in the courts of Ontario, Canada.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
              <p>
                If you have questions about these Terms, contact us at{" "}
                <a href="mailto:legal@avallon.ca" className="text-primary hover:underline">
                  legal@avallon.ca
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
