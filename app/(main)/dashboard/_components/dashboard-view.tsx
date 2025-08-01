"use client"

import { Brain, BriefcaseIcon, LineChart, TrendingDown, TrendingUp } from "lucide-react";
import { format,formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

 export type SalaryRange = {
  role: string;
  min: number;
  max: number;
  median: number;
};

type IndustryInsight = {
  salaryRanges: SalaryRange[];
  marketOutlook: string;
  lastUpdated: string | Date;
  nextUpdate: string | Date;
  demandLevel: string;
  growthRate: number; 
  topSkills: string[];
  keyTrends: string[];
  recommendedSkills: string[];
};


const DashboardView = ({ insights }: { insights: IndustryInsight }) => {
  // Transform salary data for the chart
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

    const getMarketOutlookInfo = (outlook: string) => {
        switch (outlook.toLowerCase()) {
        case "positive":
            return { icon: TrendingUp, color: "text-green-500" };
        case "neutral":
            return { icon: LineChart, color: "text-yellow-500" };
        case "negative":
            return { icon: TrendingDown, color: "text-red-500" };
        default:
            return { icon: LineChart, color: "text-gray-500" };
        }
    };

    const { icon: OutlookIcon, color: outlookColor } = getMarketOutlookInfo(insights.marketOutlook);


  // Format dates using date-fns
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );



  return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Badge  variant="outline">Last Updated: {lastUpdatedDate}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
                        <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{insights.marketOutlook}</div>
                        <p className="text-xs text-muted-foreground">
                            Next Update {nextUpdateDistance}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
                        <TrendingUp className={`h-4 w-4 ${outlookColor}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{insights.growthRate.toFixed(1)}%</div>
                        <Progress value={insights.growthRate} className="mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
                        <BriefcaseIcon className={`h-4 w-4 ${outlookColor}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{insights.demandLevel}</div>
                        <div className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                            insights.demandLevel
                        )}`} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
                        <Brain className={`h-4 w-4 ${outlookColor}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-1">{insights.topSkills.map((skill) => {
                            return (
                            <Badge key={skill} variant="secondary">
                                {skill}
                            </Badge>
                            )
                        })}
                        </div>
                    </CardContent>
                </Card>

            </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Salary Ranges by Role</CardTitle>
                        <CardDescription>
                            Displaying minimum, median and maximum salaries (in thousands)
                        </CardDescription>
                    </CardHeader>
                    <CardContent> 
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salaryData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip content={({active, payload, label}) => {
                                        if(active && payload && typeof label === "string") {
                                            return (
                                                <div className="bg-background border rounded-lg p-2 shadow-md">
                                                    <p className="font-medium">{label}</p>
                                                    {payload.map((item) => (
                                                        <p key={item.name} className="text-sm">
                                                            {item.name}: ${item.value}K
                                                        </p>
                                                    ))}
                                                </div>
                                            )
                                        }
                                    }}/>
                                    <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)"/>
                                    <Bar dataKey="median" fill="#64748b" name="Median Salary (K)"/>
                                    <Bar dataKey="max" fill="#475569" name="Max Salary (K)"/>

                                </BarChart>
                            </ResponsiveContainer>
                        </div>                       
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">

                    <Card>
                        <CardHeader>
                            <CardTitle>Key Industry Trends</CardTitle>
                            <CardDescription>
                                Current Trends shaping the Industry
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {insights.keyTrends.map((trend: string, index: number) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                                        <span>{trend}</span>
                                    </li>
                                ))}
                            </ul> 
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recommedned Skills</CardTitle>
                            <CardDescription>
                                Skills to consider Developing
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {insights.recommendedSkills.map((skill) => (
                                    <Badge key={skill} variant="secondary">
                                        {skill}
                                    </Badge>
                                ))}    
                            </div> 
                        </CardContent>
                    </Card>

                </div>
        </div>
    );
};

export default DashboardView;