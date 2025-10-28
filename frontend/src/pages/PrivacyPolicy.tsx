import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Avallon Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Effective Date: January 2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Privacy Matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              Avallon respects your privacy and complies with Canadian privacy laws, including 
              the Personal Information Protection and Electronic Documents Act (PIPEDA).
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p>We collect limited information necessary to operate the beta, such as:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Account information (name, email, login credentials)</li>
                <li>Usage data (analytics, logs, performance metrics)</li>
                <li>Voluntary feedback (user surveys or reports)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Operate and improve the Avallon beta</li>
                <li>Communicate updates, support, and feedback requests</li>
                <li>Ensure system security and compliance</li>
              </ul>
              <p className="mt-2 font-semibold">We do not sell or trade your personal data.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Storage and Security</h2>
              <p>We store data securely using industry-standard protections.</p>
              <p className="mt-2">
                Access to user data is limited to authorized team members and trusted service 
                providers under confidentiality agreements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
              <p>
                We may use third-party tools (e.g., analytics, hosting, authentication) that 
                process limited data on our behalf under contractual privacy protections.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
              <p>You may request:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Access to your personal data</li>
                <li>Correction or deletion of information</li>
                <li>Withdrawal of consent for data collection</li>
              </ul>
              <p className="mt-2">
                Contact us at{" "}
                <a href="mailto:privacy@avallon.ca" className="text-primary hover:underline">
                  privacy@avallon.ca
                </a>{" "}
                for any privacy requests.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
              <p>
                We retain user data only as long as necessary to operate the beta or as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. Continued use of Avallon after 
                changes means you accept the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@avallon.ca" className="text-primary hover:underline">
                  privacy@avallon.ca
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
