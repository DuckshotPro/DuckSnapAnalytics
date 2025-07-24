
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Award, 
  BarChart3, 
  Eye,
  ArrowUp,
  ArrowDown,
  Minus,
  Crown,
  Zap,
  AlertTriangle,
  Lightbulb
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

interface CompetitorAnalysisProps {
  showUpgradeButton?: boolean;
}

export function CompetitorAnalysis({ showUpgradeButton = true }: CompetitorAnalysisProps) {
  const { user } = useAuth();
  const isPremium = user?.subscription === "premium";
  const [activeTab, setActiveTab] = useState("overview");

  const { data: analysis, isLoading, refetch } = useQuery<any>({
    queryKey: ["/api/competitor-analysis"],
    enabled: isPremium,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const generateAnalysis = async () => {
    try {
      await apiRequest("POST", "/api/competitor-analysis/generate", {});
      refetch();
    } catch (error) {
      console.error("Error generating competitor analysis:", error);
    }
  };

  const getRankingColor = (ranking: number, total: number) => {
    const percentile = (total - ranking) / total;
    if (percentile >= 0.9) return "text-green-600";
    if (percentile >= 0.7) return "text-blue-600";
    if (percentile >= 0.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getMarketPositionIcon = (position: string) => {
    switch (position.toLowerCase()) {
      case "market leader":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "top performer":
        return <Award className="h-4 w-4 text-blue-500" />;
      case "above average":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "below average":
        return <TrendingDown className="h-4 w-4 text-orange-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getGrowthIcon = (rate: number) => {
    if (rate > 0.05) return <ArrowUp className="h-3 w-3 text-green-500" />;
    if (rate < -0.02) return <ArrowDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-gray-500" />;
  };

  if (!isPremium) {
    return (
      <Card className="dark-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Competitor Analysis
            </CardTitle>
            <Badge className="bg-amber-500 text-black">Premium</Badge>
          </div>
          <CardDescription>
            Analyze your performance against competitors and identify market opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 bg-muted rounded-lg text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Unlock Competitive Intelligence</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get detailed analysis of your market position, competitor benchmarks, and strategic recommendations.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="text-left">
                <p>✓ Market ranking analysis</p>
                <p>✓ Competitor benchmarking</p>
              </div>
              <div className="text-left">
                <p>✓ Strategic recommendations</p>
                <p>✓ Growth opportunities</p>
              </div>
            </div>
            {showUpgradeButton && (
              <Button className="purple-pink-gradient-bg hover:opacity-90">
                Upgrade to Premium
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Competitor Analysis
          </CardTitle>
          <Badge className="bg-amber-500 text-black">Premium</Badge>
        </div>
        <CardDescription>
          Understand your market position and identify growth opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!analysis ? (
          <div className="text-center py-6">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Generate Competitor Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Analyze your performance against similar creators in your niche
            </p>
            <Button 
              onClick={generateAnalysis}
              disabled={isLoading}
              className="purple-pink-gradient-bg hover:opacity-90"
            >
              {isLoading ? "Analyzing..." : "Generate Analysis"}
            </Button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="competitors">Competitors</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getMarketPositionIcon(analysis.insights.marketPosition)}
                    <span className="ml-2 font-medium">{analysis.insights.marketPosition}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Market Position</p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className={`text-2xl font-bold ${getRankingColor(analysis.userRanking, analysis.totalCompetitors)}`}>
                    #{analysis.userRanking}
                  </div>
                  <p className="text-sm text-muted-foreground">out of {analysis.totalCompetitors} creators</p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {((analysis.benchmarks.avgEngagementRate) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Market Avg Engagement</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-green-500" />
                  Key Recommendations
                </h4>
                <div className="space-y-2">
                  {analysis.recommendations.slice(0, 3).map((rec: string, index: number) => (
                    <div key={index} className="p-3 bg-green-50 border border-green-100 rounded-md">
                      <p className="text-sm text-green-800">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="benchmarks" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Performance Benchmarks</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Engagement Rate</span>
                        <span>{(analysis.benchmarks.avgEngagementRate * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={analysis.benchmarks.avgEngagementRate * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Growth Rate</span>
                        <span>{(analysis.benchmarks.avgFollowerGrowth * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.max(0, (analysis.benchmarks.avgFollowerGrowth + 0.05) * 100)} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Content Frequency</span>
                        <span>{analysis.benchmarks.avgContentFrequency.toFixed(1)}/week</span>
                      </div>
                      <Progress value={(analysis.benchmarks.avgContentFrequency / 7) * 100} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Top Performers</h4>
                  <div className="space-y-3">
                    {analysis.benchmarks.topPerformers.slice(0, 3).map((competitor: any, index: number) => (
                      <div key={competitor.id} className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{competitor.name}</span>
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{competitor.followers.toLocaleString()} followers</span>
                          <span>{(competitor.avgEngagementRate * 100).toFixed(1)}% engagement</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-green-500" />
                    Strengths
                  </h4>
                  <div className="space-y-2">
                    {analysis.insights.strengthAreas.map((strength: string, index: number) => (
                      <div key={index} className="p-3 bg-green-50 border border-green-100 rounded-md">
                        <p className="text-sm text-green-800">{strength}</p>
                      </div>
                    ))}
                  </div>

                  <h4 className="font-medium flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
                    Opportunities
                  </h4>
                  <div className="space-y-2">
                    {analysis.insights.opportunities.map((opportunity: string, index: number) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                        <p className="text-sm text-blue-800">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <TrendingDown className="h-4 w-4 mr-2 text-orange-500" />
                    Areas for Improvement
                  </h4>
                  <div className="space-y-2">
                    {analysis.insights.improvementAreas.map((area: string, index: number) => (
                      <div key={index} className="p-3 bg-orange-50 border border-orange-100 rounded-md">
                        <p className="text-sm text-orange-800">{area}</p>
                      </div>
                    ))}
                  </div>

                  <h4 className="font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                    Market Threats
                  </h4>
                  <div className="space-y-2">
                    {analysis.insights.threats.map((threat: string, index: number) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-100 rounded-md">
                        <p className="text-sm text-red-800">{threat}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="competitors" className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Competitor Overview</h4>
                  <span className="text-sm text-muted-foreground">
                    {analysis.totalCompetitors} creators analyzed
                  </span>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analysis.competitorData.slice(0, 10).map((competitor: any, index: number) => (
                    <div key={competitor.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{competitor.name}</span>
                        <div className="flex items-center space-x-2">
                          {getGrowthIcon(competitor.growthRate)}
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>
                          <Users className="h-3 w-3 inline mr-1" />
                          {competitor.followers.toLocaleString()}
                        </div>
                        <div>
                          <Eye className="h-3 w-3 inline mr-1" />
                          {(competitor.avgEngagementRate * 100).toFixed(1)}%
                        </div>
                        <div>
                          <BarChart3 className="h-3 w-3 inline mr-1" />
                          {competitor.contentFrequency}/week
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {analysis && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={generateAnalysis}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Regenerating..." : "Refresh Analysis"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
