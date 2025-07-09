// page.tsx
import { getIndustryInsights } from '@/actions/dashboard';
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react';
import DashboardView from './_components/dashboard-view';

const IndustryInsightsPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  const insights = await getIndustryInsights();

  if (!isOnboarded) {
    redirect("/onboarding");
  }

  // Transform insights into your expected shape
  const formattedInsights = {
    id: insights.id,
    industry: insights.industry,
    salaryRanges: insights.salaryRanges as any,
    marketOutlook: insights.marketOutlook as string,
    demandLevel: insights.demandLevel as string,
    nextUpdate: insights.nextUpdate ?? new Date(),
    lastUpdated: insights.updatedAt,
    growthRate: insights.growthRate,
    topSkills: insights.topSkills,
    keyTrends: insights.keyTrends,
    recommendedSkills: insights.recommendedSkills,
  };

  return (
    <div className='container mx-auto'>
      <DashboardView insights={formattedInsights} />
    </div>
  );
};

export default IndustryInsightsPage;
