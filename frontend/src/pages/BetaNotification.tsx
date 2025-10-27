import { motion } from "framer-motion";
import { CheckCircle, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const BetaNotification = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">Thank You for Your Support!</CardTitle>
            <CardDescription className="text-base">
              Your account has been successfully created
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Beta Release Notification
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    You will be notified via email when our beta version is released. 
                    Stay tuned for updates about Avallon!
                  </p>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  We're working hard to bring you the best web creation experience.
                </p>
                <p className="text-sm text-muted-foreground">
                  Thank you for being part of our journey!
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={() => navigate("/")} 
                className="w-full button-gradient"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BetaNotification;
