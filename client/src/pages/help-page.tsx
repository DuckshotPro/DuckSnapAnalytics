import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PremiumBadge } from "@/components/common/PremiumBadge";
import { toast } from "@/hooks/use-toast";
import {
  HelpCircle,
  MessageSquare,
  FileQuestion,
  LifeBuoy,
  Video,
  Lightbulb,
  Clock,
  Lock,
  Loader2
} from "lucide-react";
import { Link } from "wouter";

export default function HelpPage() {
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const handleSubmitTicket = () => {
    if (!subject || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Support Ticket Submitted",
        description: `Your ticket has been received. ${isPremium ? "A support agent will respond within 24 hours." : "We'll review your request as soon as possible."}`,
      });
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground mt-1">Get assistance with DuckShots SnapAlytics</p>
        </div>
        <div className="mt-4 md:mt-0">
          {isPremium ? (
            <div className="flex items-center space-x-2">
              <PremiumBadge isPremium />
              <div className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-md flex items-center">
                <Clock className="h-3 w-3 mr-1" /> Priority Support
              </div>
            </div>
          ) : (
            <div className="text-sm bg-amber-100 text-amber-700 px-2 py-1 rounded-md flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Standard Support
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Contact Support
                </CardTitle>
                {isPremium ? (
                  <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    24h Response Time
                  </div>
                ) : (
                  <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    72h Response Time
                  </div>
                )}
              </div>
              <CardDescription>
                {isPremium 
                  ? "As a premium member, you have access to priority support with 24-hour response time."
                  : "Submit your question and our team will get back to you as soon as possible."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input 
                  id="subject" 
                  placeholder="Briefly describe your issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea 
                  id="message" 
                  placeholder="Please provide as much detail as possible"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              {!isPremium && (
                <div className="text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-md p-3">
                  Note: Free tier support is limited to basic technical issues. For faster response times and priority support, consider upgrading to premium.
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                onClick={handleSubmitTicket}
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </Button>
              {isPremium && (
                <Button variant="outline">
                  <Video className="mr-2 h-4 w-4" /> Request Video Call
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Support Options</CardTitle>
              <CardDescription>Available support channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-2 hover:bg-muted rounded transition-colors">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-xs text-muted-foreground">
                    {isPremium ? "24h response time" : "72h response time"}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-2 hover:bg-muted rounded transition-colors">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <LifeBuoy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Help Center</p>
                  <p className="text-xs text-muted-foreground">
                    Self-service support articles
                  </p>
                </div>
              </div>
              <div className={`flex items-center p-2 ${isPremium ? "hover:bg-muted" : "opacity-60"} rounded transition-colors`}>
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Video Support</p>
                    {!isPremium && <Lock className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isPremium ? "Schedule a 30-minute call" : "Premium feature"}
                  </p>
                </div>
              </div>
              <div className={`flex items-center p-2 ${isPremium ? "hover:bg-muted" : "opacity-60"} rounded transition-colors`}>
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Strategy Consultation</p>
                    {!isPremium && <Lock className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isPremium ? "Monthly strategy review" : "Premium feature"}
                  </p>
                </div>
              </div>
            </CardContent>
            {!isPremium && (
              <CardFooter>
                <Link href="/pricing" className="w-full">
                  <Button className="w-full">Upgrade for Priority Support</Button>
                </Link>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      <Tabs defaultValue="faq" className="mb-8">
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions about DuckShots SnapAlytics</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is DuckShots SnapAlytics?</AccordionTrigger>
                  <AccordionContent>
                    DuckShots SnapAlytics is a powerful analytics platform designed specifically for Snapchat creators and marketers. It helps you track performance, analyze audience demographics, and optimize your content strategy.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I connect my Snapchat account?</AccordionTrigger>
                  <AccordionContent>
                    To connect your Snapchat account, go to the Connect Account page and enter your Snapchat API credentials. Once connected, we'll start syncing your data automatically.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What's the difference between free and premium plans?</AccordionTrigger>
                  <AccordionContent>
                    The free plan includes basic analytics, 30-day data retention, and standard support. The premium plan adds AI-powered insights, extended data history, advanced reporting, priority support, and exports in multiple formats.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How often is my data updated?</AccordionTrigger>
                  <AccordionContent>
                    Free accounts have data updated once every 24 hours. Premium accounts receive data updates every 15 minutes for near real-time analytics.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Can I export my data?</AccordionTrigger>
                  <AccordionContent>
                    Yes, premium users can export data in multiple formats including PDF, CSV, Excel, and PowerPoint. Free users have limited export capabilities.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>How secure is my data?</AccordionTrigger>
                  <AccordionContent>
                    We use industry-standard encryption and security practices to protect your data. Your Snapchat credentials are encrypted, and we maintain strict data access controls.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                  <AccordionTrigger>How do I cancel my subscription?</AccordionTrigger>
                  <AccordionContent>
                    You can cancel your premium subscription at any time from the Settings page. Your premium features will remain active until the end of your current billing period.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guides" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started Guide</CardTitle>
                <CardDescription>Set up your account and first analytics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">Learn how to connect your Snapchat account, navigate the dashboard, and understand your first analytics.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="text-xs text-primary">1</span>
                    </div>
                    <span>Creating your account</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="text-xs text-primary">2</span>
                    </div>
                    <span>Connecting to Snapchat</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="text-xs text-primary">3</span>
                    </div>
                    <span>Understanding your dashboard</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="text-xs text-primary">4</span>
                    </div>
                    <span>Reading your first analytics</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Read Guide</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Content Optimization</CardTitle>
                  {!isPremium && (
                    <div className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-md flex items-center">
                      <Lock className="h-3 w-3 mr-1" /> Premium
                    </div>
                  )}
                </div>
                <CardDescription>Strategies to improve engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isPremium ? (
                  <>
                    <p className="text-sm">Learn advanced strategies to optimize your content for maximum engagement and growth.</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                          <span className="text-xs text-primary">1</span>
                        </div>
                        <span>Analyzing audience demographics</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                          <span className="text-xs text-primary">2</span>
                        </div>
                        <span>Content timing optimization</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                          <span className="text-xs text-primary">3</span>
                        </div>
                        <span>Engagement trigger patterns</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                          <span className="text-xs text-primary">4</span>
                        </div>
                        <span>Advanced content strategy frameworks</span>
                      </li>
                    </ul>
                  </>
                ) : (
                  <div className="h-[150px] flex flex-col items-center justify-center text-center">
                    <Lock className="h-10 w-10 text-amber-500 mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Advanced content optimization strategies are available with a premium subscription.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {isPremium ? (
                  <Button variant="outline" className="w-full">Read Guide</Button>
                ) : (
                  <Link href="/pricing" className="w-full">
                    <Button className="w-full">Upgrade to Access</Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Understanding Metrics</CardTitle>
                <CardDescription>Learn what each metric means</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">A comprehensive explanation of all analytics metrics available in DuckShots SnapAlytics.</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 bg-muted rounded-md">Engagement Rate</div>
                  <div className="p-2 bg-muted rounded-md">Completion Rate</div>
                  <div className="p-2 bg-muted rounded-md">Screenshot Rate</div>
                  <div className="p-2 bg-muted rounded-md">Share Rate</div>
                  <div className="p-2 bg-muted rounded-md">Viewer Retention</div>
                  <div className="p-2 bg-muted rounded-md">Growth Rate</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Glossary</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Competitive Analysis</CardTitle>
                  {!isPremium && (
                    <div className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-md flex items-center">
                      <Lock className="h-3 w-3 mr-1" /> Premium
                    </div>
                  )}
                </div>
                <CardDescription>Benchmarking against competitors</CardDescription>
              </CardHeader>
              <CardContent>
                {isPremium ? (
                  <div className="space-y-4">
                    <p className="text-sm">Learn how to use our competitive analysis tools to benchmark your performance against similar creators.</p>
                    <div className="text-sm space-y-2">
                      <p className="font-medium">Includes:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Industry benchmarks</li>
                        <li>Competitor performance analysis</li>
                        <li>Content gap identification</li>
                        <li>Trend detection techniques</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="h-[150px] flex flex-col items-center justify-center text-center">
                    <Lock className="h-10 w-10 text-amber-500 mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Competitive analysis tools and guides are exclusive to premium subscribers.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {isPremium ? (
                  <Button variant="outline" className="w-full">Read Guide</Button>
                ) : (
                  <Link href="/pricing" className="w-full">
                    <Button className="w-full">Upgrade to Access</Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tutorials" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Getting Started Tutorial</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                  <FileQuestion className="h-12 w-12 text-muted-foreground/60" />
                </div>
                <p className="text-sm text-muted-foreground">
                  A complete walkthrough of connecting your Snapchat account and navigating the dashboard.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Watch Tutorial</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Advanced Analytics</CardTitle>
                  {!isPremium && (
                    <div className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-md flex items-center">
                      <Lock className="h-3 w-3 mr-1" /> Premium
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                  {isPremium ? (
                    <FileQuestion className="h-12 w-12 text-muted-foreground/60" />
                  ) : (
                    <Lock className="h-12 w-12 text-amber-500/60" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isPremium 
                    ? "Deep dive into advanced analytics features and how to leverage them for growth." 
                    : "This tutorial is only available for premium subscribers."}
                </p>
              </CardContent>
              <CardFooter>
                {isPremium ? (
                  <Button variant="outline" className="w-full">Watch Tutorial</Button>
                ) : (
                  <Link href="/pricing" className="w-full">
                    <Button className="w-full">Upgrade to Access</Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Content Strategy Basics</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                  <FileQuestion className="h-12 w-12 text-muted-foreground/60" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Learn how to interpret your analytics to improve your content strategy and grow your audience.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Watch Tutorial</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}