
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, AlertCircle, Clock } from "lucide-react";
import { Link } from "wouter";

export default function SnapchatPrerequisites() {
  const prerequisites = [
    {
      title: "Snapchat Developer Account",
      description: "You must have a Snapchat Developer account to access the API credentials",
      status: "required",
      steps: [
        "Visit developers.snapchat.com",
        "Sign up with your Snapchat account",
        "Complete the developer verification process",
        "Agree to the Snapchat Developer Terms of Service"
      ],
      estimatedTime: "5-10 minutes",
      link: "https://developers.snapchat.com/"
    },
    {
      title: "Create a Snapchat App",
      description: "Create an application in the Snapchat Developer Console to get your API credentials",
      status: "required",
      steps: [
        "Log into the Snapchat Developer Console",
        "Click 'Create App' or 'New App'",
        "Fill in your app details (name, description, etc.)",
        "Select the appropriate app type and permissions",
        "Submit for review if required"
      ],
      estimatedTime: "10-15 minutes",
      link: "https://developers.snapchat.com/manage/"
    },
    {
      title: "API Credentials",
      description: "Obtain your Client ID and Client Secret from your Snapchat app",
      status: "required",
      steps: [
        "Navigate to your app in the Developer Console",
        "Go to the 'App Details' or 'Credentials' section",
        "Copy your Client ID",
        "Copy your Client Secret (API Secret Key)",
        "Keep these credentials secure and private"
      ],
      estimatedTime: "2-3 minutes"
    },
    {
      title: "Business Verification (Optional)",
      description: "Some advanced features may require business verification",
      status: "optional",
      steps: [
        "Provide business documentation",
        "Complete identity verification",
        "Wait for Snapchat's approval process"
      ],
      estimatedTime: "1-3 business days"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Snapchat Integration Prerequisites
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Before connecting your Snapchat account, please ensure you have completed the following requirements.
            </p>
          </div>

          <div className="grid gap-6 mb-8">
            {prerequisites.map((prereq, index) => (
              <Card key={index} className="dark-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{prereq.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {prereq.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={prereq.status === "required" ? "destructive" : "secondary"}>
                        {prereq.status}
                      </Badge>
                      {prereq.estimatedTime && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {prereq.estimatedTime}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-foreground">Steps:</h4>
                    <ol className="space-y-2">
                      {prereq.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    {prereq.link && (
                      <Button variant="outline" size="sm" asChild className="mt-3">
                        <a href={prereq.link} target="_blank" rel="noopener noreferrer">
                          Open Snapchat Developer Console
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="dark-card border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Important Notes</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Keep your API credentials secure and never share them publicly</li>
                    <li>• Snapchat may require app review for certain permissions</li>
                    <li>• API rate limits apply - check Snapchat's documentation for details</li>
                    <li>• Your app must comply with Snapchat's API Terms of Service</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild>
              <Link href="/connect-account">I have my credentials - Connect Account</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
